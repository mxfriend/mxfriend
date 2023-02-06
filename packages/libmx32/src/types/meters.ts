import { AbstractMeterBank, Int16MeterBank, MeterBanks as MeterBanksCommon } from '@mxfriend/common';

function floatToDb(value: number): number {
  return 20 * Math.log10(value);
}

function dbToFloat(value: number): number {
  return 10 ** (value / 20);
}

export class Float32MeterBank extends AbstractMeterBank<Float32Array> {
  constructor(size: number) {
    super(Float32Array, size);
  }

  $toDb(): number[];
  $toDb(idx: number): number;
  $toDb(idx?: number): number | number[] {
    return idx === undefined
      ? [...this.$get()].map(floatToDb)
      : floatToDb(this.$get(idx));
  }

  $fromDb(values: number[], local?: boolean, peer?: unknown): void;
  $fromDb(idx: number, value: number, local?: boolean, peer?: unknown): void;
  $fromDb(idxOrValues: number | number[], value?: any, local?: any, peer?: any): void {
    if (typeof idxOrValues === 'number') {
      this.$set(idxOrValues, dbToFloat(value), local, peer);
    } else {
      this.$set(new Float32Array(idxOrValues.map(dbToFloat)), value, local);
    }
  }
}

type MeterBankConstructor = {
  new (size: number): AbstractMeterBank;
};

const meterBanks: [MeterBankConstructor, number][] = [
  [Float32MeterBank, 70], // METERS page
  [Float32MeterBank, 96], // METERS/channel
  [Float32MeterBank, 49], // METERS/mixbus
  [Float32MeterBank, 22], // METERS/aux/fx
  [Float32MeterBank, 82], // METERS/in/out
  [Float32MeterBank, 27], // Control surface meters
  [Float32MeterBank, 4], // Channel strip
  [Float32MeterBank, 16], // Bus send meters
  [Float32MeterBank, 6], // Matrix send meters
  [Float32MeterBank, 32], // Fx send & return
  [Float32MeterBank, 32], // Fx
  [Float32MeterBank, 5], // Monitor
  [Float32MeterBank, 4], // Recorder
  [Float32MeterBank, 48], // METERS page brief
  [Float32MeterBank, 14], // Fx
  [Int16MeterBank, 50], // RTA
  [Int16MeterBank, 48], // Comp & automix
];

export class MeterBanks extends MeterBanksCommon<Float32MeterBank | Int16MeterBank> {
  constructor() {
    super((i) => new meterBanks[i][0](meterBanks[i][1]), { size: meterBanks.length, base: 0 });
  }
}
