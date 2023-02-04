import { isOSCType, osc, OSCArgument } from '@mxfriend/osc';
import { FloatValue, IntValue, Value } from '@mxfriend/oscom';
import { ValueMap } from '../maps';
import { intFromBatchBlob, intToBatchBlob } from './utils';

const $map = Symbol('map');

export class MappedValue extends FloatValue {
  private readonly [$map]: ValueMap;

  constructor(map: ValueMap) {
    super();
    this[$map] = map;
  }

  $fromValue(value: number, local: boolean = true, peer?: unknown): void {
    this.$set(this[$map].toFloat(value), local, peer);
  }

  $toValue(): number | undefined {
    const value = this.$get();
    return value === undefined ? undefined : this[$map].toValue(value);
  }

  $fromText(value: string, local: boolean = true, peer?: unknown): void {
    this.$fromValue(this.$parse(value), local, peer);
  }

  $toText(): string | undefined {
    const value = this.$toValue();
    return value === undefined ? undefined : this.$format(value);
  }
}


export class BitmaskValue extends IntValue {
  constructor(size: number) {
    super();
    this.$setTextFormat(
      (v) => `%${v.toString(2).padStart(size, '0')}`,
      (v) => parseInt(v.replace(/^%/, ''), 2),
    );
  }
}


export class RawEnumValue<T extends number> extends Value<T> {
  $fromOSC(arg: OSCArgument, local: boolean | undefined, peer: unknown | undefined): void {
    if (isOSCType(arg, 'i')) {
      this.$set(arg.value as T, local, peer);
    }
  }

  $toOSC(): OSCArgument | undefined {
    return osc.optional.int(this.$get());
  }

  $fromText(value: string, local?: boolean, peer?: unknown) {
    if (value.match(/^\d+$/)) {
      this.$set(parseInt(value, 10) as T, local, peer);
    }
  }

  $toText(): string | undefined {
    return this.$get()?.toString();
  }

  $fromBatchBlob = intFromBatchBlob;
  $toBatchBlob = intToBatchBlob;
}
