import { createEnum, EnumType } from '@mxfriend/oscom';

export const DelayFactor = createEnum({
  'F1_4': 0, 'F3_8': 1, 'F1_2': 2, 'F2_3': 3, 'F1': 4, 'F4_3': 5, 'F3_2': 6, 'F2': 7, 'F3': 8,
} as const, ['1/4', '3/8', '1/2', '2/3', '1', '4/3', '3/2', '2', '3']);

export type DelayFactor = EnumType<typeof DelayFactor>;

export const SimpleDelayFactor = createEnum({
  'F1': 0, 'F1_2': 1, 'F2_3': 3, 'F3_2': 4,
} as const, ['1', '1/2', '2/3', '3/2']);

export type SimpleDelayFactor = EnumType<typeof SimpleDelayFactor>;

export const DelayPattern = createEnum({
  'F1_4': 0, 'F1_3': 1, 'F3_8': 2, 'F1_2': 3, 'F2_3': 4, 'F3_4': 5, 'F1': 6,
  'F1_4X': 7, 'F1_3X': 8, 'F3_8X': 9, 'F1_2X': 10, 'F2_3X': 11, 'F3_4X': 12, 'F1X': 13,
} as const, ['1/4', '1/3', '3/8', '1/2', '2/3', '3/4', '1', '1/4X', '1/3X', '3/8X', '1/2X', '2/3X', '3/4X', '1X']);

export type DelayPattern = EnumType<typeof DelayPattern>;

export const VintageReverbSide = createEnum({ Front: 0, Rear: 1 } as const);
export type VintageReverbSide = EnumType<typeof VintageReverbSide>;

export const ModulationDelaySetup = createEnum({ Parallel: 0, Serial: 1 } as const, ['PAR', 'SER']);
export type ModulationDelaySetup = EnumType<typeof ModulationDelaySetup>;

export const ModulationDelayType = createEnum({ Ambience: 0, Club: 1, Hall: 2 } as const, ['AMB', 'CLUB', 'HALL']);
export type ModulationDelayType = EnumType<typeof ModulationDelayType>;

export const FeedbackMode = createEnum({
  Stereo: 0,
  Cross: 1,
  Mono: 2,
} as const, ['ST', 'X', 'M']);
export type FeedbackMode = EnumType<typeof FeedbackMode>;

export const MoodFilterMode = createEnum({
  LowPass: 0, HighPass: 1, BandPass: 2, Notch: 3,
} as const, ['LP', 'HP', 'BP', 'NO']);
export type MoodFilterMode = EnumType<typeof MoodFilterMode>;

export const MoodFilterWave = createEnum({
  Triangle: 0, Sine: 1, Saw: 2, InvSaw: 3, Ramp: 4, Square: 5, Random: 6,
} as const, ['TRI', 'SIN', 'SAW', 'SAW-', 'RMP', 'SQU', 'RND']);
export type MoodFilterWave = EnumType<typeof MoodFilterWave>;

export const DeEsserVoice = createEnum({ Female: 0, Male: 1 } as const, { Female: 'FEM' });
export type DeEsserVoice = EnumType<typeof DeEsserVoice>;

export const DeEsserMode = createEnum({ Stereo: 0, MidSide: 1 } as const, ['ST', 'MS']);
export type DeEsserMode = EnumType<typeof DeEsserMode>;

export const Xtec1ALoFreq = createEnum({
  'F20': 0, 'F30': 1, 'F60': 2, 'F100': 3,
} as const, ['20', '30', '60', '100']);
export type Xtec1ALoFreq = EnumType<typeof Xtec1ALoFreq>;

export const Xtec1AMidFreq = createEnum({
  'F3k': 0, 'F4k': 1, 'F5k': 2, 'F8k': 3, 'F10k': 4, 'F12k': 5, 'F16k': 6,
} as const, ['3k', '4k', '5k', '8k', '10k', '12k', '16k']);
export type Xtec1AMidFreq = EnumType<typeof Xtec1AMidFreq>;

export const Xtec1AHiFreq = createEnum({
  'F5k': 0, 'F10k': 1, 'F20k': 2,
} as const, ['5k', '10k', '20k']);
export type Xtec1AHiFreq = EnumType<typeof Xtec1AHiFreq>;

export const XtecQ5LoFreq = createEnum({
  'F200': 0, 'F300': 1, 'F500': 2, 'F700': 3, 'F1000': 4,
} as const, ['200', '300', '500', '700', '1000']);
export type XtecQ5LoFreq = EnumType<typeof XtecQ5LoFreq>;

export const XtecQ5MidFreq = createEnum({
  'F200': 0, 'F300': 1, 'F500': 2, 'F700': 3, 'F1k': 4, 'F1k5': 5, 'F2k': 6, 'F3k': 7, 'F4k': 8, 'F5k': 9, 'F7k': 10,
} as const, ['200', '300', '500', '700', '1k', '1k5', '2k', '3k', '4k', '5k', '7k']);
export type XtecQ5MidFreq = EnumType<typeof XtecQ5MidFreq>;

export const XtecQ5HiFreq = createEnum({
  'F1k5': 0, 'F2k': 1, 'F3k': 2, 'F4k': 3, 'F5k': 4,
} as const, ['1k5', '2k', '3k', '4k', '5k']);
export type XtecQ5HiFreq = EnumType<typeof XtecQ5HiFreq>;

export const LeisureCompMode = createEnum({ Compressor: 0, Limiter: 1 } as const, ['COMP', 'LIM']);
export type LeisureCompMode = EnumType<typeof LeisureCompMode>;

export const UltimoCompRatio = createEnum({
  'R4': 0, 'R8': 1, 'R12': 2, 'R20': 3, 'All': 4,
} as const, ['4', '8', '12', '20', 'ALL']);
export type UltimoCompRatio = EnumType<typeof UltimoCompRatio>;

export const EdisonEX1Mode = createEnum({ Stereo: 0, MidSide: 1 } as const, ['ST', 'M/S']);
export type EdisonEX1Mode = EnumType<typeof EdisonEX1Mode>;

export const SuboctaverRange = createEnum({ Low: 0, Mid: 1, High: 2 } as const, ['LO', 'MID', 'HI']);
export type SuboctaverRange = EnumType<typeof SuboctaverRange>;

export const DimensionalChorusMode = createEnum({ Mono: 0, Stereo: 1 } as const, ['M', 'ST']);
export type DimensionalChorusMode = EnumType<typeof DimensionalChorusMode>;

export const CombinatorBandSolo = createEnum({
  Off: 0, Bd1: 1, Bd2: 2, Bd3: 3, Bd4: 4, Bd5: 5,
} as const, { Off: 'OFF' }, false);
export type CombinatorBandSolo = EnumType<typeof CombinatorBandSolo>;

export const CombinatorXoverSlope = createEnum({ 'X12': 0, 'X48': 1 } as const, ['12', '48']);
export type CombinatorXoverSlope = EnumType<typeof CombinatorXoverSlope>;


export const CombinatorRatio = createEnum({
  'R1_1': 0, 'R1_2': 1, 'R1_3': 2, 'R1_5': 3, 'R1_7': 4, 'R2': 5, 'R2_5': 6, 'R3': 7, 'R3_5': 8, 'R4': 9, 'R5': 10, 'R7': 11, 'R10': 12, 'Lim': 13,
} as const, ['1.1', '1.2', '1.3', '1.5', '1.7', '2', '2.5', '3', '3.5', '4', '5', '7', '10', 'LIM']);
export type CombinatorRatio = EnumType<typeof CombinatorRatio>;

export const CombinatorMeterMode = createEnum({ GR: 0, SBC: 1, Peak: 2 } as const);
export type CombinatorMeterMode = EnumType<typeof CombinatorMeterMode>;
