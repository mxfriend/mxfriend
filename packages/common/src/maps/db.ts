import { ValueMap } from './valueMap';

export class DbMap extends ValueMap {
  toFloat(value: number): number {
    return value <= -90 ? 0 : super.toFloat(value);
  }

  toValue(float: number): number {
    return float <= 0 ? -Infinity : super.toValue(float);
  }
}
