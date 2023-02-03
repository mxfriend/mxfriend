import { FloatValue, IntValue } from '@mxfriend/oscom';
import { ValueMap } from '../maps';

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
