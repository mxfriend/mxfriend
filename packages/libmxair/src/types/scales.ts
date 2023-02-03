import { Scale, quantize, limit } from '@mxfriend/oscom';

export class LogScale implements Scale {
  private readonly min: number;
  private readonly max: number;
  private readonly steps: number;
  private readonly amin: number;
  private readonly amax: number;
  private readonly base: number;

  constructor(min: number, max: number, steps: number) {
    if (min < 0 || max < 0) {
      throw new Error(`Log scale doesn't support negative boundaries, <${min}, ${max}> given`);
    }

    this.min = min;
    this.max = max;
    this.steps = steps;
    this.amin = Math.min(min, max);
    this.amax = Math.max(min, max);
    this.base = Math.log(this.max / this.min);
  }

  rawToValue(value: number): number {
    return this.min * Math.exp(value * this.base);
  }

  valueToRaw(value: number): number {
    return quantize(Math.log(limit(value, this.amin, this.amax) / this.min) / this.base, this.steps);
  }
}
