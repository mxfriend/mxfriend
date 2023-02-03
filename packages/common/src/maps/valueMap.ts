import { BufferInterface } from '@mxfriend/osc';

export class ValueMap {
  private readonly floatToValue: Map<number, number>;
  private readonly valueToFloat: Map<number, number>;
  private readonly floats: number[];
  private readonly values: number[];

  constructor(data: BufferInterface) {
    [this.floatToValue, this.valueToFloat, this.floats, this.values] = parseData(data);
  }

  toFloat(value: number): number {
    return lookup(value, this.valueToFloat, this.values);
  }

  toValue(float: number): number {
    return lookup(float, this.floatToValue, this.floats);
  }
}

function parseData(data: BufferInterface): [Map<number, number>, Map<number, number>, number[], number[]] {
  const floatToValue: Map<number, number> = new Map();
  const valueToFloat: Map<number, number> = new Map();
  const floats: number[] = [];
  const values: number[] = [];
  let previous: number = Number.NaN;
  let consecutive: number[] = [];

  for (let i = 0; i < data.byteLength; i += 12) {
    const float = data.readFloatBE(i);
    const value = data.readDoubleBE(i + 4);

    floatToValue.set(float, value);
    floats.push(float);

    if (value === previous) {
      consecutive.push(float);
      continue;
    }

    if (consecutive.length > 1) {
      valueToFloat.set(previous, consecutive[Math.floor(consecutive.length / 2)]);
      values.push(previous);
    }

    valueToFloat.set(value, float);
    values.push(value);
    consecutive = [float];
    previous = value;
  }

  if (consecutive.length > 1) {
    valueToFloat.set(previous, consecutive[Math.floor(consecutive.length / 2)]);
    values.push(previous);
  }

  if (values[0] > values[values.length - 1]) {
    values.reverse();
  }

  return [floatToValue, valueToFloat, floats, values];
}

function lookup(key: number, map: Map<number, number>, index: number[]): number {
  const value = map.get(key);

  if (value !== undefined) {
    return value;
  }

  let lo = 0, hi = index.length - 1, mid: number;

  while (hi - lo > 1) {
    mid = Math.floor((lo + hi) / 2);

    if (index[mid] < key) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return map.get(key - index[lo] <= index[hi] - key ? index[lo] : index[hi])!;
}
