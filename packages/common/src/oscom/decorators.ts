import {
  ContainerPropertyDecorator,
  FactoryCache,
  createFactoryDecorator,
  NumericValue,
  createFactoryWrapper,
} from '@mxfriend/oscom';
import { DbMap, getValueMap, ValueMapConstructor } from '../maps';
import { createFormatter, createParser } from './utils';
import { MappedValue, BitmaskValue } from './values';


const formatters = new FactoryCache(createFormatter);
const parsers = new FactoryCache(createParser);

export function formatted<T extends NumericValue>(value: T, format: number | string): T {
  value.$setTextFormat(formatters.get(format), parsers.get(format));
  return value;
}

export function Formatted(format: number | string): ContainerPropertyDecorator {
  return createFactoryWrapper((value: NumericValue) => {
    value.$setTextFormat(formatters.get(format), parsers.get(format));
    return value;
  });
}

export function Mapped(map: ValueMapConstructor): ContainerPropertyDecorator;
export function Mapped(lo: number, hi: number, res: number): ContainerPropertyDecorator;
export function Mapped(map: any, hi?: any, res?: any): ContainerPropertyDecorator {
  return createFactoryDecorator(() => new MappedValue(getValueMap(map, hi, res)));
}

export function Fader(resolution: 161 | 1024 = 1024): ContainerPropertyDecorator {
  return createFactoryDecorator(() => formatted(new MappedValue(getValueMap(DbMap, -Infinity, 10, resolution)), '-.1$'));
}

export function Frequency(resolution: 121 | 201 = 201): ContainerPropertyDecorator {
  return createFactoryDecorator(() => formatted(new MappedValue(getValueMap(20, 20000, resolution)), '.1k'));
}

export function Bitmask(size: number): ContainerPropertyDecorator {
  return createFactoryDecorator(() => new BitmaskValue(size));
}
