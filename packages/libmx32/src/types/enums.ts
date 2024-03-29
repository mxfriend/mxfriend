import { createEnum, EnumDefinition, EnumType } from '@mxfriend/oscom';

export const Color = createEnum({
  Off: 0, Red: 1, Green: 2, Yellow: 3, Blue: 4, Magenta: 5, Cyan: 6, White: 7, InvOff: 8, InvRed: 9,
  InvGreen: 10, InvYellow: 11, InvBlue: 12, InvMagenta: 13, InvCyan: 14, InvWhite: 15,
} as const, [
  'OFF', 'RD', 'GN', 'YE', 'BL', 'MG', 'CY', 'WH',
  'OFFi', 'RDi', 'GNi', 'YEi', 'BLi', 'MGi', 'CYi', 'WHi',
]);
export type Color = EnumType<typeof Color>;

export const InputSource = createEnum({
  Off: 0, In01: 1, In02: 2, In03: 3, In04: 4, In05: 5, In06: 6, In07: 7, In08: 8, In09: 9,
  In10: 10, In11: 11, In12: 12, In13: 13, In14: 14, In15: 15, In16: 16, In17: 17, In18: 18, In19: 19,
  In20: 20, In21: 21, In22: 22, In23: 23, In24: 24, In25: 25, In26: 26, In27: 27, In28: 28, In29: 29,
  In30: 30, In31: 31, In32: 32, Aux1: 33, Aux2: 34, Aux3: 35, Aux4: 36, Aux5: 37, Aux6: 38,
  UsbL: 39, UsbR: 40, Fx1L: 41, Fx1R: 42, Fx2L: 43, Fx2R: 44, Fx3L: 45, Fx3R: 46, Fx4L: 47, Fx4R: 48,
  Bus01: 49, Bus02: 50, Bus03: 51, Bus04: 52, Bus05: 53, Bus06: 54, Bus07: 55, Bus08: 56,
  Bus09: 57, Bus10: 58, Bus11: 59, Bus12: 60, Bus13: 61, Bus14: 62, Bus15: 63, Bus16: 64,
} as const, { Off: 'OFF', UsbL: 'USB L', UsbR: 'USB R' }, false);
export type InputSource = EnumType<typeof InputSource>;

export const HpSlope = createEnum({ S12: 0, S18: 1, S24: 2 } as const, ['12', '18', '24']);
export type HpSlope = EnumType<typeof HpSlope>;

export const GateMode = createEnum({ Exp2: 0, Exp3: 1, Exp4: 2, Gate: 3, Ducker: 4 } as const, { Ducker: 'DUCK' }, true);
export type GateMode = EnumType<typeof GateMode>;

export const InsertPos = createEnum({ Pre: 0, Post: 1 } as const);
export type InsertPos = EnumType<typeof InsertPos>;

export const InsertSlot = createEnum({
  Off: 0, Fx1L: 1, Fx1R: 2, Fx2L: 3, Fx2R: 4, Fx3L: 5, Fx3R: 6, Fx4L: 7, Fx4R: 8,
  Fx5L: 9, Fx5R: 10, Fx6L: 11, Fx6R: 12, Fx7L: 13, Fx7R: 14, Fx8L: 15, Fx8R: 16,
  Aux1: 17, Aux2: 18, Aux3: 19, Aux4: 20, Aux5: 21, Aux6: 22,
} as const);
export type InsertSlot = EnumType<typeof InsertSlot>;

export const ExtendedEqBandType = createEnum({
  LCut: 0, LShv: 1, PEQ: 2, VEQ: 3, HShv: 4, HCut: 5,
  BU6: 6, BU12: 7, BS12: 8, LR12: 9, BU18: 10, BU24: 11, BS24: 12, LR24: 13,
} as const, undefined, false);
export type ExtendedEqBandType = EnumType<typeof ExtendedEqBandType>;

export const SendType = createEnum({
  Input: 0, PreEQ: 1, PostEQ: 2, PreFader: 3, PostFader: 4, Subgroup: 5,
} as const, ['IN/LC', '<-EQ', 'EQ->', 'PRE', 'POST', 'GRP'], false);
export type SendType = EnumType<typeof SendType>;

export const MatrixSendType = createEnum({
  Input: 0, PreEQ: 1, PostEQ: 2, PreFader: 3, PostFader: 4,
} as const, ['IN/LC', '<-EQ', 'EQ->', 'PRE', 'POST'], false);
export type MatrixSendType = EnumType<typeof MatrixSendType>;

export const MonoMode = createEnum({ LRM: 0, LCR: 1 } as const, ['LR+M', 'LCR'], false);
export type MonoMode = EnumType<typeof MonoMode>;

export const SoloSource = createEnum({
  Off: 0, LR: 1, LRC: 2, LRPFL: 3, LRAFL: 4, Aux56: 5, Aux78: 6,
} as const, ['OFF', 'LR', 'LR+C', 'LRPFL', 'LRAFL', 'AUX56', 'AUX78'], false);
export type SoloSource = EnumType<typeof SoloSource>;

export const TalkbackSource = createEnum({ Internal: 0, External: 1 } as const, ['INT', 'EXT'], false);
export type TalkbackSource = EnumType<typeof TalkbackSource>;

export const OscillatorFreqSel = createEnum({ F1: 0, F2: 1 } as const);
export type OscillatorFreqSel = EnumType<typeof OscillatorFreqSel>;

export const OscillatorType = createEnum({
  Sine: 0, PinkNoise: 1, WhiteNoise: 2,
} as const, ['SINE', 'PINK', 'WHITE'], false);
export type OscillatorType = EnumType<typeof OscillatorType>;

// intentionally not createEnum()
export const OscillatorDestination = {
  Bus1: 0, Bus2: 1, Bus3: 2, Bus4: 3, Bus5: 4, Bus6: 5, Bus7: 6, Bus8: 7,
  Bus9: 8, Bus10: 9, Bus11: 10, Bus12: 11, Bus13: 12, Bus14: 13, Bus15: 14, Bus16: 15,
  L: 16, R: 17, LR: 18, MC: 19, Matrix1: 20, Matrix2: 21, Matrix3: 22, Matrix4: 23,
  Matrix5: 24, Matrix6: 25,
} as const;
export type OscillatorDestination = EnumType<typeof OscillatorDestination>;



// intentionally not createEnum()
export const UserInSource = {
  Off: 0, LocalIn1: 1, LocalIn2: 2, LocalIn3: 3, LocalIn4: 4, LocalIn5: 5, LocalIn6: 6, LocalIn7: 7,
  LocalIn8: 8, LocalIn9: 9, LocalIn10: 10, LocalIn11: 11, LocalIn12: 12, LocalIn13: 13,
  LocalIn14: 14, LocalIn15: 15, LocalIn16: 16, LocalIn17: 17, LocalIn18: 18, LocalIn19: 19,
  LocalIn20: 20, LocalIn21: 21, LocalIn22: 22, LocalIn23: 23, LocalIn24: 24, LocalIn25: 25,
  LocalIn26: 26, LocalIn27: 27, LocalIn28: 28, LocalIn29: 29, LocalIn30: 30, LocalIn31: 31,
  LocalIn32: 32, AES50A1: 33, AES50A2: 34, AES50A3: 35, AES50A4: 36, AES50A5: 37, AES50A6: 38,
  AES50A7: 39, AES50A8: 40, AES50A9: 41, AES50A10: 42, AES50A11: 43, AES50A12: 44, AES50A13: 45,
  AES50A14: 46, AES50A15: 47, AES50A16: 48, AES50A17: 49, AES50A18: 50, AES50A19: 51, AES50A20: 52,
  AES50A21: 53, AES50A22: 54, AES50A23: 55, AES50A24: 56, AES50A25: 57, AES50A26: 58, AES50A27: 59,
  AES50A28: 60, AES50A29: 61, AES50A30: 62, AES50A31: 63, AES50A32: 64, AES50A33: 65, AES50A34: 66,
  AES50A35: 67, AES50A36: 68, AES50A37: 69, AES50A38: 70, AES50A39: 71, AES50A40: 72, AES50A41: 73,
  AES50A42: 74, AES50A43: 75, AES50A44: 76, AES50A45: 77, AES50A46: 78, AES50A47: 79, AES50A48: 80,
  AES50B1: 81, AES50B2: 82, AES50B3: 83, AES50B4: 84, AES50B5: 85, AES50B6: 86, AES50B7: 87,
  AES50B8: 88, AES50B9: 89, AES50B10: 90, AES50B11: 91, AES50B12: 92, AES50B13: 93, AES50B14: 94,
  AES50B15: 95, AES50B16: 96, AES50B17: 97, AES50B18: 98, AES50B19: 99, AES50B20: 100,
  AES50B21: 101, AES50B22: 102, AES50B23: 103, AES50B24: 104, AES50B25: 105, AES50B26: 106,
  AES50B27: 107, AES50B28: 108, AES50B29: 109, AES50B30: 110, AES50B31: 111, AES50B32: 112,
  AES50B33: 113, AES50B34: 114, AES50B35: 115, AES50B36: 116, AES50B37: 117, AES50B38: 118,
  AES50B39: 119, AES50B40: 120, AES50B41: 121, AES50B42: 122, AES50B43: 123, AES50B44: 124,
  AES50B45: 125, AES50B46: 126, AES50B47: 127, AES50B48: 128, CardIn1: 129, CardIn2: 130,
  CardIn3: 131, CardIn4: 132, CardIn5: 133, CardIn6: 134, CardIn7: 135, CardIn8: 136, CardIn9: 137,
  CardIn10: 138, CardIn11: 139, CardIn12: 140, CardIn13: 141, CardIn14: 142, CardIn15: 143,
  CardIn16: 144, CardIn17: 145, CardIn18: 146, CardIn19: 147, CardIn20: 148, CardIn21: 149,
  CardIn22: 150, CardIn23: 151, CardIn24: 152, CardIn25: 153, CardIn26: 154, CardIn27: 155,
  CardIn28: 156, CardIn29: 157, CardIn30: 158, CardIn31: 159, CardIn32: 160, AuxIn1: 161,
  AuxIn2: 162, AuxIn3: 163, AuxIn4: 164, AuxIn5: 165, AuxIn6: 166, TBInternal: 167, TBExternal: 168,
} as const;
export type UserInSource = EnumType<typeof UserInSource>;



export const UserOutDest = {
  ...UserInSource,
  Outputs1: 169, Outputs2: 170, Outputs3: 171, Outputs4: 172, Outputs5: 173, Outputs6: 174,
  Outputs7: 175, Outputs8: 176, Outputs9: 177, Outputs10: 178, Outputs11: 179, Outputs12: 180,
  Outputs13: 181, Outputs14: 182, Outputs15: 183, Outputs16: 184, P16_1: 185, P16_2: 186, P16_3: 187,
  P16_4: 188, P16_5: 189, P16_6: 190, P16_7: 191, P16_8: 192, P16_9: 193, P16_10: 194, P16_11: 195,
  P16_12: 196, P16_13: 197, P16_14: 198, P16_15: 199, P16_16: 200, Aux1: 201, Aux2: 202, Aux3: 203,
  Aux4: 204, Aux5: 205, Aux6: 206, MonitorL: 207, MonitorR: 208,
} as const;
export type UserOutDest = EnumType<typeof UserOutDest>;



export const RoutingSwitch = createEnum({ Rec: 0, Play: 1 } as const);
export type RoutingSwitch = EnumType<typeof RoutingSwitch>;



export const InputBlock = createEnum({
  Local1_8: 0, Local9_16: 1, Local17_24: 2, Local25_32: 3,
  A1_8: 4, A9_16: 5, A17_24: 6, A25_32: 7, A33_40: 8, A41_48: 9,
  B1_8: 10, B9_16: 11, B17_24: 12, B25_32: 13, B33_40: 14, B41_48: 15,
  CARD1_8: 16, CARD9_16: 17, CARD17_24: 18, CARD25_32: 19,
  UserIn1_8: 20, UserIn9_16: 21, UserIn17_24: 22, UserIn25_32: 23,
} as const, [
  'AN1-8', 'AN9-16', 'AN17-24', 'AN25-32',
  'A1-8', 'A9-16', 'A17-24', 'A25-32', 'A33-40', 'A41-48',
  'B1-8', 'B9-16', 'B17-24', 'B25-32', 'B33-40', 'B41-48',
  'CARD1-8', 'CARD9-16', 'CARD17-24', 'CARD25-32',
  'UIN1-8', 'UIN9-16', 'UIN17-24', 'UIN25-32',
], false);
export type InputBlock = EnumType<typeof InputBlock>;



export const AuxInPatch = createEnum({
  Aux1_4: 0, Local1_2: 1, Local1_4: 2, Local1_6: 3, A1_2: 4, A1_4: 5, A1_6: 6, B1_2: 7, B1_4: 8, B1_6: 9,
  Card1_2: 10, Card1_4: 11, Card1_6: 12, UserIn1_2: 13, UserIn1_4: 14, UserIn1_6: 15,
} as const, [
  'AUX1-4', 'AN1-2', 'AN1-4', 'AN1-6', 'A1-2', 'A1-4', 'A1-6', 'B1-2', 'B1-4', 'B1-6',
  'CARD1-2', 'CARD1-4', 'CARD1-6', 'UIN1-2', 'UIN1-4', 'UIN1-6',
], false);
export type AuxInPatch = EnumType<typeof AuxInPatch>;



export const PatchBlock = createEnum({
  Local1_8: 0, Local9_16: 1, Local17_24: 2, Local25_32: 3,
  A1_8: 4, A9_16: 5, A17_24: 6, A25_32: 7, A33_40: 8, A41_48: 9,
  B1_8: 10, B9_16: 11, B17_24: 12, B25_32: 13, B33_40: 14, B41_48: 15,
  Card1_8: 16, Card9_16: 17, Card17_24: 18, Card25_32: 19,
  Out1_8: 20, Out9_16: 21, P161_8: 22, P169_16: 23, Aux1_6Mon: 24, AuxIn1_6TB: 25,
  UserOut1_8: 26, UserOut9_16: 27, UserOut17_24: 28, UserOut25_32: 29, UserOut33_40: 30, UserOut41_48: 31,
  UserIn1_8: 32, UserIn9_16: 33, UserIn17_24: 34, UserIn25_32: 35,
} as const, [
  'AN1-8', 'AN9-16', 'AN17-24', 'AN25-32',
  'A1-8', 'A9-16', 'A17-24', 'A25-32', 'A33-40', 'A41-48',
  'B1-8', 'B9-16', 'B17-24', 'B25-32', 'B33-40', 'B41-48',
  'CARD1-8', 'CARD9-16', 'CARD17-24', 'CARD25-32',
  'OUT1-8', 'OUT9-16', 'P161-8', 'P169-16', 'AUX1-6/Mon', 'AuxIN1-6/TB',
  'UOUT1-8', 'UOUT9-16', 'UOUT17-24', 'UOUT25-32', 'UOUT33-40', 'UOUT41-48',
  'UIN1-8', 'UIN9-16', 'UIN17-24', 'UIN25-32',
], false);
export type PatchBlock = EnumType<typeof PatchBlock>;



export const OutputBlockOdd = createEnum({
  Local1_4: 0, Local9_12: 1, Local17_20: 2, Local25_28: 3,
  A1_4: 4, A9_12: 5, A17_20: 6, A25_28: 7, A33_36: 8, A41_44: 9,
  B1_4: 10, B9_12: 11, B17_20: 12, B25_28: 13, B33_36: 14, B41_44: 15,
  Card1_4: 16, Card9_12: 17, Card17_20: 18, Card25_28: 19,
  Out1_4: 20, Out9_12: 21, P161_4: 22, P169_12: 23, AuxCR: 24, AuxTB: 25,
  UserOut1_4: 26, UserOut9_12: 27, UserOut17_20: 28, UserOut25_28: 29, UserOut33_36: 30, UserOut41_44: 31,
  UserIn1_4: 32, UserIn9_12: 33, UserIn17_20: 34, UserIn25_28: 35,
} as const, [
  'AN1-4', 'AN9-12', 'AN17-20', 'AN25-28',
  'A1-4', 'A9-12', 'A17-20', 'A25-28', 'A33-36', 'A41-44',
  'B1-4', 'B9-12', 'B17-20', 'B25-28', 'B33-36', 'B41-44',
  'CARD1-4', 'CARD9-12', 'CARD17-20', 'CARD25-28',
  'OUT1-4', 'OUT9-12', 'P161-4', 'P169-12', 'AUX/CR', 'AUX/TB',
  'UOUT1-4', 'UOUT9-12', 'UOUT17-20', 'UOUT25-28', 'UOUT33-36', 'UOUT41-44',
  'UIN1-4', 'UIN9-12', 'UIN17-20', 'UIN25-28',
], false);
export type OutputBlockOdd = EnumType<typeof OutputBlockOdd>;

export const OutputBlockEven = createEnum({
  Local5_8: 0, Local13_16: 1, Local21_24: 2, Local29_32: 3,
  A5_8: 4, A13_16: 5, A21_24: 6, A29_32: 7, A37_40: 8, A45_48: 9,
  B5_8: 10, B13_16: 11, B21_24: 12, B29_32: 13, B37_40: 14, B45_48: 15,
  Card5_8: 16, Card13_16: 17, Card21_24: 18, Card29_32: 19,
  Out5_8: 20, Out13_16: 21, P165_8: 22, P1613_16: 23, AuxCR: 24, AuxTB: 25,
  UserOut5_8: 26, UserOut13_16: 27, UserOut21_24: 28, UserOut29_32: 29, UserOut37_40: 30, UserOut45_48: 31,
  UserIn5_8: 32, UserIn13_16: 33, UserIn21_24: 34, UserIn29_32: 35,
} as const, [
  'AN5-8', 'AN13-16', 'AN21-24', 'AN29-32',
  'A5-8', 'A13-16', 'A21-24', 'A29-32', 'A37-40', 'A45-48',
  'B5-8', 'B13-16', 'B21-24', 'B29-32', 'B37-40', 'B45-48',
  'CARD5-8', 'CARD13-16', 'CARD21-24', 'CARD29-32',
  'OUT5-8', 'OUT13-16', 'P165-8', 'P1613-16', 'AUX/CR', 'AUX/TB',
  'UOUT5-8', 'UOUT13-16', 'UOUT21-24', 'UOUT29-32', 'UOUT37-40', 'UOUT45-48',
  'UIN5-8', 'UIN13-16', 'UIN21-24', 'UIN29-32',
], false);
export type OutputBlockEven = EnumType<typeof OutputBlockEven>;


export const AES50Port = createEnum({ A: 0, B: 1 } as const, ['AESA', 'AESB'], false);
export type AES50Port = EnumType<typeof AES50Port>;


export const FxSource = createEnum({
  Insert: 0, Mix1: 1, Mix2: 2, Mix3: 3, Mix4: 4, Mix5: 5, Mix6: 6, Mix7: 7, Mix8: 8, Mix9: 9,
  Mix10: 10, Mix11: 11, Mix12: 12, Mix13: 13, Mix14: 14, Mix15: 15, Mix16: 16, MC: 17,
} as const, [
  'INS', 'MIX1', 'MIX2', 'MIX3', 'MIX4', 'MIX5', 'MIX6', 'MIX7', 'MIX8', 'MIX9', 'MIX10',
  'MIX11', 'MIX12', 'MIX13', 'MIX14', 'MIX15', 'MIX16', 'M/C',
], false);
export type FxSource = EnumType<typeof FxSource>;

export const InsertFxType = createEnum({
  DualGEQ: 0, StereoGEQ: 1, DualTEQ: 2, StereoTEQ: 3, DualDeEsser: 4, StereoDeEsser: 5,
  StereoXtec1A: 6, DualXtec1A: 7, StereoXtecQ5: 8, DualXtecQ5: 9, WaveDesigner: 10,
  PrecisionLimiter: 11, StereoFairComp: 12, MidSideFairComp: 13, DualFairComp: 14,
  StereoLeisureComp: 15, DualLeisureComp: 16, StereoUltimoComp: 17, DualUltimoComp: 18,
  DualEnhancer: 19, StereoEnhancer: 20, DualExciter: 21, StereoExciter: 22, StereoImager: 23,
  EdisonEX1: 24, SoundMaxer: 25, DualGuitarAmp: 26, StereoGuitarAmp: 27, DualTubeStage: 28,
  StereoTubeStage: 29, Phaser: 30, MoodFilter: 31, TremoloPanner: 32, Suboctaver: 33,
} as const, [
  'GEQ2', 'GEQ', 'TEQ2', 'TEQ', 'DES2', 'DES', 'P1A', 'P1A2', 'PQ5', 'PQ5S', 'WAVD', 'LIM', 'FAC',
  'FAC1M', 'FAC2', 'LEC', 'LEC2', 'ULC', 'ULC2', 'ENH2', 'ENH', 'EXC2', 'EXC', 'IMG', 'EDI', 'SON',
  'AMP2', 'AMP', 'DRV2', 'DRV', 'PHAS', 'FILT', 'PAN', 'SUB',
], false);
export type InsertFxType = EnumType<typeof InsertFxType>;



export const OutputSource = {
  Off: 0, MainL: 1, MainR: 2, MC: 3, MixBus01: 4, MixBus02: 5, MixBus03: 6, MixBus04: 7,
  MixBus05: 8, MixBus06: 9, MixBus07: 10, MixBus08: 11, MixBus09: 12, MixBus10: 13, MixBus11: 14,
  MixBus12: 15, MixBus13: 16, MixBus14: 17, MixBus15: 18, MixBus16: 19, Matrix1: 20, Matrix2: 21,
  Matrix3: 22, Matrix4: 23, Matrix5: 24, Matrix6: 25, DirectOutCh01: 26, DirectOutCh02: 27,
  DirectOutCh03: 28, DirectOutCh04: 29, DirectOutCh05: 30, DirectOutCh06: 31, DirectOutCh07: 32,
  DirectOutCh08: 33, DirectOutCh09: 34, DirectOutCh10: 35, DirectOutCh11: 36, DirectOutCh12: 37,
  DirectOutCh13: 38, DirectOutCh14: 39, DirectOutCh15: 40, DirectOutCh16: 41, DirectOutCh17: 42,
  DirectOutCh18: 43, DirectOutCh19: 44, DirectOutCh20: 45, DirectOutCh21: 46, DirectOutCh22: 47,
  DirectOutCh23: 48, DirectOutCh24: 49, DirectOutCh25: 50, DirectOutCh26: 51, DirectOutCh27: 52,
  DirectOutCh28: 53, DirectOutCh29: 54, DirectOutCh30: 55, DirectOutCh31: 56, DirectOutCh32: 57,
  DirectOutAux1: 58, DirectOutAux2: 59, DirectOutAux3: 60, DirectOutAux4: 61, DirectOutAux5: 62,
  DirectOutAux6: 63, DirectOutAux7: 64, DirectOutAux8: 65, DirectOutFX1L: 66, DirectOutFX1R: 67,
  DirectOutFX2L: 68, DirectOutFX2R: 69, DirectOutFX3L: 70, DirectOutFX3R: 71, DirectOutFX4L: 72,
  DirectOutFX4R: 73, MonitorL: 74, MonitorR: 75, Talkback: 76,
} as const;
export type OutputSource = EnumType<typeof OutputSource>;


export const OutputPos = createEnum({
  InLC: 0, InLCMute: 1, PreEQ: 2, PreEQMute: 3, PostEQ: 4, PostEQMute: 5, PreFader: 6,
  PreFaderMute: 7, PostFader: 8,
} as const, ['IN/LC', 'IN/LC+M', '<-EQ', '<-EQ+M', 'EQ->', 'EQ->+M', 'PRE', 'PRE+M', 'POST'], false);
export type OutputPos = EnumType<typeof OutputPos>;


export const iQGroup = createEnum({ Off: 0, A: 1, B: 2 } as const);
export type iQGroup = EnumType<typeof iQGroup>;

export const iQSpeaker = createEnum({
  None: 0, iQ8: 1, iQ10: 2, iQ12: 3, iQ15: 4, iQ15B: 5, iQ18B: 6,
} as const, { None: 'none' }, false);
export type iQSpeaker = EnumType<typeof iQSpeaker>;

export const iQEQ = createEnum({
  Linear: 0, Live: 1, Speech: 2, Playback: 3, User: 4,
} as const, undefined, false);
export type iQEQ = EnumType<typeof iQEQ>;

export const iQ8Model = createEnum({
  iQ8: 0, E8: 1, F8Plus: 2, UPJunior: 3, PS8: 4, NuQ8DP: 5,
} as const, ['iQ8', 'E8', 'F8+', 'UPJunior', 'PS8', 'NuQ8-DP'], false);
export type iQ8Model = EnumType<typeof iQ8Model>;

export const iQ10Model = createEnum({
  iQ10: 0, E8: 1, F10Plus: 2, UPJ1P: 3, PS10R2: 4, NuQ10DP: 5,
} as const, ['iQ10', 'F10+', 'UPJ-1P', 'PS10-R2', 'NuQ10-DP'], false);
export type iQ10Model = EnumType<typeof iQ10Model>;

export const iQ12Model = createEnum({
  iQ12: 0, E12: 1, JF29NT: 2, ELX112P: 3, PRX612M: 4, F12Plus: 5, UPA1P: 6, NuQ12DP: 7,
} as const, ['iQ12', 'E12', 'JF29NT', 'ELX112P', 'PRX612M', 'F12+', 'UPA-1P', 'NuQ12-DP'], false);
export type iQ12Model = EnumType<typeof iQ12Model>;

export const iQ15Model = createEnum({
  iQ15: 0, JF59NT: 1, ELX115P: 2, PRX615M: 3, F15Plus: 4, UPQ1P: 5, PS15R2: 6, NuQ15DP: 7,
} as const, ['iQ15', 'JF59NT', 'ELX115P', 'PRX615M', 'F15+', 'UPQ-1P', 'PS15-R2', 'NuQ15-DP'], false);
export type iQ15Model = EnumType<typeof iQ15Model>;

export const iQ15BModel = createEnum({
  iQ15B: 0, E15X: 1, S15Plus: 2, B15DP: 3,
} as const, ['iQ15B', 'E15X', 'S15+', 'B-15DP'], false);
export type iQ15BModel = EnumType<typeof iQ15BModel>;

export const iQ18BModel = createEnum({
  iQ18B: 0, ELX18P: 1, PRX6118S: 2, S18Plus: 3, B18DP: 4,
} as const, ['iQ18B', 'ELX18P', 'PRX6118S', 'S18+', 'B-18DP'], false);
export type iQ18BModel = EnumType<typeof iQ18BModel>;

export const iQModelMap: Record<Exclude<iQSpeaker, 0>, EnumDefinition> = {
  [iQSpeaker.iQ8]: iQ8Model,
  [iQSpeaker.iQ10]: iQ10Model,
  [iQSpeaker.iQ12]: iQ12Model,
  [iQSpeaker.iQ15]: iQ15Model,
  [iQSpeaker.iQ15B]: iQ15BModel,
  [iQSpeaker.iQ18B]: iQ18BModel,
};




export const CueMidiType = { None: 0, ProgramChange: 1, ControlChange: 2, Note: 3 } as const;
export type CueMidiType = EnumType<typeof CueMidiType>;


export const ClockSource = createEnum({
  Internal: 0, AES50A: 1, AES50B: 2, Card: 3,
} as const, ['INT', 'AES50A', 'AES50B', 'CARD'], false);
export type ClockSource = EnumType<typeof ClockSource>;

export const ShowControlMode = createEnum({ Cues: 0, Scenes: 1, Snippets: 2 } as const);
export type ShowControlMode = EnumType<typeof ShowControlMode>;

export const ClockMode = createEnum({ C24: 0, C12: 1 } as const, ['24h', '12h'], false);
export type ClockMode = EnumType<typeof ClockMode>;

export const MuteLedMode = createEnum({ Normal: 0, Invert: 1 } as const, ['NORM', 'INV'], false);
export type MuteLedMode = EnumType<typeof MuteLedMode>;


export const RecorderControl = createEnum({ USB: 0, XLive: 1 } as const);
export type RecorderControl = EnumType<typeof RecorderControl>;


export const ControlSurfaceProtocol = createEnum({
  MackieHCU: 0, MackieHUI: 1, Generic: 2,
} as const, ['MC', 'HUI', 'CC'], false);
export type ControlSurfaceProtocol = EnumType<typeof ControlSurfaceProtocol>;

export const ControlSurfacePort = createEnum({ MIDI: 0, Card: 1, RTP: 2 } as const);
export type ControlSurfacePort = EnumType<typeof ControlSurfacePort>;

export const UFMode = createEnum({
  U32_32: 0, U16_16: 1, U32_8: 2, U8_32: 3,
} as const, ['32/32', '16/16', '32/8', '8/32'], false);
export type UFMode = EnumType<typeof UFMode>;

export const USBMode = createEnum({
  U32_32: 0, U16_16: 1, U32_8: 2, U8_32: 3, U8_8: 4, U2_2: 5,
} as const, ['32/32', '16/16', '32/8', '8/32', '8/8', '2/2'], false);
export type USBMode = EnumType<typeof USBMode>;

export const ADATWordClock = createEnum({ In: 0, Out: 1 } as const);
export type ADATWordClock = EnumType<typeof ADATWordClock>;

export const ADATSync = createEnum({
  WordClock: 0, ADAT1: 1, ADAT2: 2, ADAT3: 3, ADAT4: 4,
} as const, { WordClock: 'WC' }, false);
export type ADATSync = EnumType<typeof ADATSync>;

export const MADIMode = createEnum({ M56: 0, M64: 1 } as const, ['56', '64'], false);
export type MADIMode = EnumType<typeof MADIMode>;

export const MADIIn = createEnum({
  In1_32: 0, In9_40: 1, In17_48: 2, In25_56: 3, In33_64: 4,
} as const, ['1-32', '9-40', '17-48', '25-56', '33-64'], false);
export type MADIIn = EnumType<typeof MADIIn>;

export const MADIOut = createEnum({
  Off: 0, Out1_32: 1, Out9_40: 2, Out17_48: 3, Out25_56: 4, Out33_64: 5,
} as const, ['OFF', '1-32', '9-40', '17-48', '25-56', '33-64'], false);
export type MADIOut = EnumType<typeof MADIOut>;

export const MADISrc = createEnum({ Off: 0, Optical: 1, Coax: 2, Both: 3 } as const, { Optical: 'OPT' });
export type MADISrc = EnumType<typeof MADISrc>;

export const URecCard = createEnum({ SD1: 0, SD2: 1 } as const);
export type URecCard = EnumType<typeof URecCard>;

export const URecTracks = createEnum({ Ch32: 0, Ch16: 1, Ch8: 2 } as const, ['32Ch', '16Ch', '8Ch'], false);
export type URecTracks = EnumType<typeof URecTracks>;

export const URecPlaybackSource = createEnum({ SD: 0, USB: 1 } as const);
export type URecPlaybackSource = EnumType<typeof URecPlaybackSource>;

export const URecOutputSource = createEnum({ Rec: 0, Play: 1, Auto: 2 } as const);
export type URecOutputSource = EnumType<typeof URecOutputSource>;


export const RTAVisibility = createEnum({
  Off: 0, P25: 1, P30: 2, P35: 3, P40: 4, P45: 5, P50: 6, P55: 7, P60: 8, P65: 9, P70: 10, P75: 11, P80: 12,
} as const, ['OFF', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%'], false);
export type RTAVisibility = EnumType<typeof RTAVisibility>;

export const RTASource = {
  None: 0, Monitor: 1, Ch01: 2, Ch02: 3, Ch03: 4, Ch04: 5, Ch05: 6, Ch06: 7, Ch07: 8, Ch08: 9,
  Ch09: 10, Ch10: 11, Ch11: 12, Ch12: 13, Ch13: 14, Ch14: 15, Ch15: 16, Ch16: 17, Ch17: 18,
  Ch18: 19, Ch19: 20, Ch20: 21, Ch21: 22, Ch22: 23, Ch23: 24, Ch24: 25, Ch25: 26, Ch26: 27,
  Ch27: 28, Ch28: 29, Ch29: 30, Ch30: 31, Ch31: 32, Ch32: 33, Aux1: 34, Aux2: 35, Aux3: 36,
  Aux4: 37, Aux5: 38, Aux6: 39, Aux7: 40, Aux8: 41, Fx1L: 42, Fx1R: 43, Fx2L: 44, Fx2R: 45,
  Fx3L: 46, Fx3R: 47, Fx4L: 48, Fx4R: 49, Bus01: 50, Bus02: 51, Bus03: 52, Bus04: 53, Bus05: 54,
  Bus06: 55, Bus07: 56, Bus08: 57, Bus09: 58, Bus10: 59, Bus11: 60, Bus12: 61, Bus13: 62, Bus14: 63,
  Bus15: 64, Bus16: 65, Mtx1: 66, Mtx2: 67, Mtx3: 68, Mtx4: 69, Mtx5: 70, Mtx6: 71, Main: 72, Mono: 73,
} as const;
export type RTASource = EnumType<typeof RTASource>;

export const RTAPos = createEnum({ Pre: 0, Post: 1 } as const);
export type RTAPos = EnumType<typeof RTAPos>;

export const RTAMode = createEnum({
  Bar: 0, Spectrogram: 1,
} as const, ['BAR', 'SPEC'], false);
export type RTAMode = EnumType<typeof RTAMode>;

export const RTADetector = createEnum({ RMS: 0, Peak: 1 } as const);
export type RTADetector = EnumType<typeof RTADetector>;

export const RTAPeakHold = createEnum({
  Off: 0, H1: 1, H2: 2, H3: 3, H4: 4, H5: 5, H6: 6, H7: 7, H8: 8,
} as const, ['OFF', '1', '2', '3', '4', '5', '6', '8', '8'], false);
export type RTAPeakHold = EnumType<typeof RTAPeakHold>;


export const KeyboardLayout = createEnum({
  Qwerty: 0, Qwertz: 1, Azerty: 2, Abcdef: 3,
} as const);
export type KeyboardLayout = EnumType<typeof KeyboardLayout>;


export const SelectedChannel = createEnum({
  Ch01: 0, Ch02: 1, Ch03: 2, Ch04: 3, Ch05: 4, Ch06: 5, Ch07: 6, Ch08: 7, Ch09: 8, Ch10: 9,
  Ch11: 10, Ch12: 11, Ch13: 12, Ch14: 13, Ch15: 14, Ch16: 15, Ch17: 16, Ch18: 17, Ch19: 18,
  Ch20: 19, Ch21: 20, Ch22: 21, Ch23: 22, Ch24: 23, Ch25: 24, Ch26: 25, Ch27: 26, Ch28: 27,
  Ch29: 28, Ch30: 29, Ch31: 30, Ch32: 31, Aux1: 32, Aux2: 33, Aux3: 34, Aux4: 35, Aux5: 36,
  Aux6: 37, Aux7: 38, Aux8: 39, Fx1L: 40, Fx1R: 41, Fx2L: 42, Fx2R: 43, Fx3L: 44, Fx3R: 45,
  Fx4L: 46, Fx4R: 47, Bus1: 48, Bus2: 49, Bus3: 50, Bus4: 51, Bus5: 52, Bus6: 53, Bus7: 54,
  Bus8: 55, Bus9: 56, Bus10: 57, Bus11: 58, Bus12: 59, Bus13: 60, Bus14: 61, Bus15: 62, Bus16: 63,
  Mtx1: 64, Mtx2: 65, Mtx3: 66, Mtx4: 67, Mtx5: 68, Mtx6: 69, LR: 70, MC: 71,
} as const, undefined, false);
export type SelectedChannel = EnumType<typeof SelectedChannel>;

export const ChannelFaderBank = { Ch1_16: 0, Ch17_32: 1, AuxIn: 2, BusMasters: 3 } as const;
export type ChannelFaderBank = EnumType<typeof ChannelFaderBank>;

export const GroupFaderBank = { DCA1_8: 0, Bus1_8: 1, Bus9_16: 2, Matrix1_6: 3, Unknown: 4, Ch1_16: 5 } as const;
export type GroupFaderBank = EnumType<typeof GroupFaderBank>;

export const BusSendBank = { Bus1_4: 0, Bus5_8: 1, Bus9_12: 2, Bus13_16: 3 } as const;
export type BusSendBank = EnumType<typeof BusSendBank>;

export const EqBand = { Low: 0, Low2: 1, LowMid: 2, HiMid: 3, Hi2: 4, Hi: 5 } as const;
export type EqBand = EnumType<typeof EqBand>;

export const UserBank = { A: 0, B: 1, C: 2 } as const;
export type UserBank = EnumType<typeof UserBank>;

export const LockState = { Unlocked: 0, Locked: 1, Shutdown: 2 } as const;
export type LockState = EnumType<typeof LockState>;

export const XCardType = {
  None: 0, XUF: 1, XUSB: 2, XDante: 3, XADAT: 4, XMADI: 5,
  DN32USB: 6, DN32Dante: 7, DN32ADAT: 8, DN32MADI: 9,
  XLive: 10, XWSG: 11,
} as const;
export type XCardType = EnumType<typeof XCardType>;

export const Screen = createEnum({
  Home: 0, Meters: 1, Routing: 2, Setup: 3, Library: 4, Effects: 5,
  Monitor: 6, USB: 7, Scenes: 8, Assign: 9, Lock: 10,
} as const);
export type Screen = EnumType<typeof Screen>;

export const HomePage = createEnum({
  Home: 0, Config: 1, Gate: 2, Dyn: 3, Eq: 4, Sends: 5, Main: 6,
} as const);
export type HomePage = EnumType<typeof HomePage>;

export const MetersPage = createEnum({
  Channel: 0, MixBus: 1, AuxFx: 2, InOut: 3, RTA: 4, Automix: 5,
} as const, { AuxFx: 'AUX/FX', InOut: 'IN/OUT', Automix: 'AMIX' });
export type MetersPage = EnumType<typeof MetersPage>;

export const RoutingPage = createEnum({
  Input: 0, AES50A: 1, AES50B: 2, Card: 3, XLR: 4, Outputs: 5, AuxOut: 6, P16: 7, User: 8,
} as const, ['HOME', 'AES50A', 'AES50B', 'CARDOUT', 'XLROUT', 'ANAOUT', 'AUXOUT', 'P16OUT', 'USER']);
export type RoutingPage = EnumType<typeof RoutingPage>;

export const SetupPage = createEnum({
  Global: 0, Config: 1, Remote: 2, Network: 3, NameIcon: 4, Preamps: 5, Card: 6,
} as const, ['GLOB', 'CONF', 'REMOTE', 'NETW', 'NAMES', 'PREAMPS', 'CARD']);
export type SetupPage = EnumType<typeof SetupPage>;

export const LibraryPage = createEnum({
  Channel: 0, Effects: 1, Routing: 2, Monitor: 3,
} as const, ['CHAN', 'EFFECT', 'ROUTE', 'MONITOR']);
export type LibraryPage = EnumType<typeof LibraryPage>;

export const FxPage = createEnum({
  Home: 0, Fx1: 1, Fx2: 2, Fx3: 3, Fx4: 4, Fx5: 5, Fx6: 6, Fx7: 7, Fx8: 8,
} as const);
export type FxPage = EnumType<typeof FxPage>;

export const MonitorPage = createEnum({
  Monitor: 0, TalkA: 1, TalkB: 2, Osc: 3,
} as const);
export type MonitorPage = EnumType<typeof MonitorPage>;

export const USBPage = createEnum({ Home: 0, Config: 1 } as const);
export type USBPage = EnumType<typeof USBPage>;

export const ScenePage = createEnum({
  Cues: 0, Scenes: 1, Snippets: 2, ParamSafe: 3, ChannelSafe: 4, MIDI: 5,
} as const, ['HOME', 'SCENES', 'BITS', 'PARSAFE', 'CHNSAFE', 'MIDI']);
export type ScenePage = EnumType<typeof ScenePage>;

export const AssignPage = createEnum({ Home: 0, SetA: 1, SetB: 2, SetC: 3 } as const);
export type AssignPage = EnumType<typeof AssignPage>;

export const TapeState = createEnum({
  Stop: 0, Pause: 1, Play: 2, PauseRecord: 3, Record: 4, FF: 5, Rew: 6,
} as const);
export type TapeState = EnumType<typeof TapeState>;

export const URecState = createEnum({ Stop: 0, PPause: 1, Play: 2, Rec: 3 } as const);
export type URecState = EnumType<typeof URecState>;


export const BatteryState = createEnum({ None: 0, Good: 1, Low: 2 } as const);
export type BatteryState = EnumType<typeof BatteryState>;

export const XLiveSrate = { R44k1: 0, R48k: 1 } as const;
export type XLiveSrate = EnumType<typeof XLiveSrate>;

export const XLiveTracks = { None: 0, X8: 1, X16: 2, X32: 3 } as const;
export type XLiveTracks = EnumType<typeof XLiveTracks>;

export const XLiveSpan = { None: 0, Span1of2: 1, Span2of2: 2, JumpTo2of2: 3 } as const;
export type XLiveSpan = EnumType<typeof XLiveSpan>;

export const XLiveSDState = createEnum({ None: 0, Ready: 1, Protect: 2, Error: 3 } as const);
export type XLiveSDState = EnumType<typeof XLiveSDState>;
