import { createEnum, EnumType } from '@mxfriend/oscom';

export const Bool = createEnum({
  Off: 0,
  On: 1,
});
export type Bool = EnumType<typeof Bool>;


export const ClockRate = createEnum({ 'R48k': 0, 'R44k1': 1 } as const, ['48K', '44K1']);
export type ClockRate = EnumType<typeof ClockRate>;


export const CompressorMode = createEnum({
  Comp: 0, Exp: 1,
} as const);
export type CompressorMode = EnumType<typeof CompressorMode>;


export const CompressorDetection = createEnum({
  Peak: 0, RMS: 1,
} as const);
export type CompressorDetection = EnumType<typeof CompressorDetection>;


export const CompressorEnvelope = createEnum({
  Lin: 0, Log: 1,
} as const);
export type CompressorEnvelope = EnumType<typeof CompressorEnvelope>;


export const CompressorRatio = createEnum(
  {
    R1_1: 0, R1_3: 1, R1_5: 2, R2_0: 3, R2_5: 4, R3_0: 5, R4_0: 6, R5_0: 7, R7_0: 8, R10: 9, R20: 10, R100: 11,
  } as const,
  [
    '1.1', '1.3', '1.5', '2.0', '2.5', '3.0', '4.0', '5.0', '7.0', '10', '20', '100',
  ],
);
export type CompressorRatio = EnumType<typeof CompressorRatio>;


export const FilterType = createEnum(
  { LC6: 0, LC12: 1, HC6: 2, HC12: 3, B1: 4, B2: 5, B3: 6, B5: 7, B10: 8 } as const,
  ['LC6', 'LC12', 'HC6', 'HC12', '1.0', '2.0', '3.0', '5.0', '10.0'],
);
export type FilterType = EnumType<typeof FilterType>;


export const EqBandType = createEnum({
  LCut: 0, LShv: 1, PEQ: 2, VEQ: 3, HShv: 4, HCut: 5,
} as const, undefined, false);
export type EqBandType = EnumType<typeof EqBandType>;


export const AutomixGroup = createEnum({
  Off: 0, X: 1, Y: 2,
} as const);
export type AutomixGroup = EnumType<typeof AutomixGroup>;


export const FxType = createEnum(
  {
    Hall: 0, Ambience: 1, RichPlate: 2, Room: 3, Chamber: 4, Plate: 5, VintageReverb: 6, VintageRoom: 7,
    GatedReverb: 8, ReverseReverb: 9, StereoDelay: 10, ThreeTapDelay: 11, FourTapDelay: 12, Chorus: 13,
    Flanger: 14, Phaser: 15, DimensionalChorus: 16, MoodFilter: 17, RotarySpeaker: 18, TremoloPanner: 19,
    Suboctaver: 20, DelayChamber: 21, ChorusChamber: 22, FlangerChamber: 23, DelayChorus: 24, DelayFlanger: 25,
    ModulationDelay: 26, DualGEQ: 27, StereoGEQ: 28, DualTEQ: 29, StereoTEQ: 30, DualDeEsser: 31, StereoDeEsser: 32,
    StereoXtec1A: 33, DualXtec1A: 34, StereoXtecQ5: 35, DualXtecQ5: 36, WaveDesigner: 37, PrecisionLimiter: 38,
    StereoCombinator: 39, DualCombinator: 40, StereoFairComp: 41, MidSideFairComp: 42, DualFairComp: 43,
    StereoLeisureComp: 44, DualLeisureComp: 45, StereoUltimoComp: 46, DualUltimoComp: 47, DualEnhancer: 48,
    StereoEnhancer: 49, DualExciter: 50, StereoExciter: 51, StereoImager: 52, EdisonEX1: 53, SoundMaxer: 54,
    DualGuitarAmp: 55, StereoGuitarAmp: 56, DualTubeStage: 57, StereoTubeStage: 58, DualPitch: 59, StereoPitch: 60,
  } as const,
  [
    'HALL', 'AMBI', 'RPLT', 'ROOM', 'CHAM', 'PLAT', 'VREV', 'VRM', 'GATE', 'RVRS', 'DLY', '3TAP', '4TAP',
    'CRS', 'FLNG', 'PHAS', 'DIMC', 'FILT', 'ROTA', 'PAN', 'SUB', 'D/RV', 'CR/R', 'FL/R', 'D/CR', 'D/FL',
    'MODD', 'GEQ2', 'GEQ', 'TEQ2', 'TEQ', 'DES2', 'DES', 'P1A', 'P1A2', 'PQ5', 'PQ52', 'WAVD', 'LIM',
    'CMB', 'CMB2', 'FAC', 'FAC1M', 'FAC2', 'LEC', 'LEC2', 'ULC', 'ULC2', 'ENH2', 'ENH', 'EXC2', 'EXC',
    'IMG', 'EDI', 'SON', 'AMP2', 'AMP', 'DRV2', 'DRV', 'PIT2', 'PIT',
  ],
);
export type FxType = EnumType<typeof FxType>;

