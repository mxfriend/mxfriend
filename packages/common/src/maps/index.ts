import { BufferInterface } from '@mxfriend/osc';
import { FactoryCache } from '@mxfriend/oscom';
import { getMapData } from './utils';
import { ValueMap } from './valueMap';

export * from './db';
export * from './valueMap';

export type ValueMapConstructor<T extends ValueMap = ValueMap> = {
  new (data: BufferInterface): T;
};

const maps = new FactoryCache((ctorOrLo: ValueMapConstructor | number, loOrHi: number, hiOrRes: number, maybeRes?: number): ValueMap => {
  const [ctor, data] = typeof ctorOrLo === 'number'
    ? [ValueMap, getMapData(ctorOrLo, loOrHi, hiOrRes)]
    : [ctorOrLo, getMapData(loOrHi, hiOrRes, maybeRes!)];
  return new ctor(data);
});

export function getValueMap(lo: number, hi: number, res: number): ValueMap;
export function getValueMap<T extends ValueMap>(ctor: ValueMapConstructor<T>, lo: number, hi: number, res: number): T;
export function getValueMap(ctorOrLo: ValueMapConstructor | number, loOrHi: number, hiOrRes: number, maybeRes?: number): ValueMap {
  return maps.get(ctorOrLo, loOrHi, hiOrRes, maybeRes);
}
