import { EnumType, createEnum } from '@mxfriend/oscom';

export const KeySolo = createEnum({
  Off: 0,
  G01:  1, G02:  2, G03:  3, G04:  4, G05:  5, G06:  6, G07:  7, G08:  8, G09:  9, G10: 10, G11: 11, G12: 12, G13: 13, G14: 14, G15: 15, G16: 16,
  D01: 17, D02: 18, D03: 19, D04: 20, D05: 21, D06: 22, D07: 23, D08: 24, D09: 25, D10: 26, D11: 27, D12: 28, D13: 29, D14: 30, D15: 31, D16: 32,
  DB01: 33, DB02: 34, DB03: 35, DB04: 36, DB05: 37, DB06: 38,
  DLR: 39,
} as const);
export type KeySolo = EnumType<typeof KeySolo>;

export const NetworkMode = createEnum({ LAN: 0, Client: 1, AP: 2 } as const, { Client: 'IS' }, false);
export type NetworkMode = EnumType<typeof NetworkMode>;

export const RTASource = createEnum({
  Ch01: 0, Ch02: 1, Ch03: 2, Ch04: 3, Ch05: 4, Ch06: 5, Ch07: 6, Ch08: 7, Ch09: 8, Ch10: 9, Ch11: 10, Ch12: 11, Ch13: 12, Ch14: 13, Ch15: 14, Ch16: 15,
  Aux: 16, Fx1: 17, Fx2: 18, Fx3: 19, Fx4: 20, Bus1: 21, Bus2: 22, Bus3: 23, Bus4: 24, Bus5: 25, Bus6: 26, Send1: 27, Send2: 28, Send3: 29, Send4: 30,
  LR: 31, Mon: 32,
} as const, { Mon: 'MON' }, false);
export type RTASource = EnumType<typeof RTASource>;

export const RTAPos = createEnum({ Pre: 0, Post: 1 } as const);
export type RTAPos = EnumType<typeof RTAPos>;

export const TapeState = createEnum({
  Stop: 0, PlayPause: 1, Play: 2, RecPause: 3, Rec: 4, FastForward: 5, Rewrind: 6,
} as const, ['STOP', 'PPAUSE', 'PLAY', 'RPAUSE', 'REC', 'FF', 'REW']);
export type TapeState = EnumType<typeof TapeState>;

export const UsbFileType = createEnum({ File: 0, Dir: 1 } as const);
export type UsbFileType = EnumType<typeof UsbFileType>;

export const UsbInterfaceMode = createEnum({ 'U18x18': 0, 'U2x2': 1 } as const, ['18x18', '2x2']);
export type UsbInterfaceMode = EnumType<typeof UsbInterfaceMode>;

export const LanMode = createEnum({ Static: 0, DHCP: 1, DHCPS: 2 } as const);
export type LanMode = EnumType<typeof LanMode>;

export const UpdateNetworkMode = createEnum({
    Noop: 0, LAN: 1, Client: 2, AccessPoint: 3,
} as const, ['NOOP', 'LAN', 'IS', 'AP']);
export type UpdateNetworkMode = EnumType<typeof UpdateNetworkMode>;

export const AccessPointSecurity = createEnum({ Open: 0, WEP: 1 } as const);
export type AccessPointSecurity = EnumType<typeof AccessPointSecurity>;

export const ClientSecurity = createEnum({ Open: 0, WEP: 1, WPA: 2, WPA2: 3 } as const);
export type ClientSecurity = EnumType<typeof ClientSecurity>;

export const ClientMode = createEnum({ DHCP: 0, Static: 1 } as const);
export type ClientMode = EnumType<typeof ClientMode>;

export const AnalogIn = createEnum({
  In01: 0, In02: 1, In03: 2, In04: 3, In05: 4, In06: 5, In07: 6, In08: 7, In09: 8, In10: 9, In11: 10, In12: 11,
  In13: 12, In14: 13, In15: 14, In16: 15, AuxL: 16, AuxR: 17, Off: 18,
} as const, { AuxL: 'L', AuxR: 'R', Off: 'OFF' }, false);
export type AnalogIn = EnumType<typeof AnalogIn>;


export const UsbIn = createEnum({
  U01: 0, U02: 1, U03: 2, U04: 3, U05: 4, U06: 5, U07: 6, U08: 7, U09: 8, U10: 9, U11: 10, U12: 11, U13: 12, U14: 13,
  U15: 14, U16: 15, U17: 16, U18: 17,
} as const);
export type UsbIn = EnumType<typeof UsbIn>;


export const StereoUsbIn = createEnum({
  U0102: 0, U0304: 1, U0506: 2, U0708: 3, U0910: 4, U1112: 5, U1314: 6, U1516: 7, U1718: 8,
} as const);
export type StereoUsbIn = EnumType<typeof StereoUsbIn>;


// intentionally not createEnum(), because Color is always represented as a number,
// so translating to string is impossible
export const Color = {
  Off: 0, Red: 1, Green: 2, Yellow: 3, Blue: 4, Magenta: 5, Cyan: 6, White: 7, InvOff: 8, InvRed: 9,
  InvGreen: 10, InvYellow: 11, InvBlue: 12, InvMagenta: 13, InvCyan: 14, InvWhite: 15,
} as const;
export type Color = EnumType<typeof Color>;


export const GateMode = createEnum({
  Gate: 0, Exp2: 1, Exp3: 2, Exp4: 3, Duck: 4,
} as const);
export type GateMode = EnumType<typeof GateMode>;




export const KeySrc = createEnum({
  Self: 0, Ch01: 1, Ch02: 2, Ch03: 3, Ch04: 4, Ch05: 5, Ch06: 6, Ch07: 7, Ch08: 8, Ch09: 9, Ch10: 10, Ch11: 11,
  Ch12: 12, Ch13: 13, Ch14: 14, Ch15: 15, Ch16: 16, Bus1: 17, Bus2: 18, Bus3: 19, Bus4: 20, Bus5: 21, Bus6: 22,
} as const, { Self: 'SELF' }, false);
export type KeySrc = EnumType<typeof KeySrc>;



export const MonoInsertSlot = createEnum({
  Off: 0, Fx1A: 1, Fx1B: 2, Fx2A: 3, Fx2B: 4, Fx3A: 5, Fx3B: 6, Fx4A: 7, Fx4B: 8,
} as const, { Off: 'OFF' }, false);
export type MonoInsertSlot = EnumType<typeof MonoInsertSlot>;


export const StereoInsertSlot = createEnum({
  Off: 0, Fx1: 1, Fx2: 2, Fx3: 3, Fx4: 4,
} as const, { Off: 'OFF' }, false);
export type StereoInsertSlot = EnumType<typeof StereoInsertSlot>;


export const EqMode = createEnum({
  PEQ: 0, GEQ: 1, TEQ: 2,
} as const);
export type EqMode = EnumType<typeof EqMode>;


export const SendTap = createEnum({
  In: 0, PreEQ: 1, PostEQ: 2, Pre: 3, Post: 4, Grp: 5,
} as const);
export type SendTap = EnumType<typeof SendTap>;


export const SoloSource = createEnum({
  Off: 0, LR: 1, LRPFL: 2, LRAFL: 3, AUX: 4, U1718: 5, Bus1: 6, Bus2: 7, Bus3: 8, Bus4: 9, Bus5: 10, Bus6: 11,
  Bus12: 12, Bus34: 13, Bus56: 14,
} as const, { Off: 'OFF' }, false);
export type SoloSource = EnumType<typeof SoloSource>;


export const MainSrc = createEnum({
  LR: 0, Mon: 1, U0102: 2, U0304: 3, U0506: 4, U0708: 5, U0910: 6, U1112: 7, U1314: 8, U1516: 9, U1718: 10,
} as const);
export type MainSrc = EnumType<typeof MainSrc>;


export const AuxSrc = createEnum({
  Ch01: 0, Ch02: 1, Ch03: 2, Ch04: 3, Ch05: 4, Ch06: 5, Ch07: 6, Ch08: 7, Ch09: 8, Ch10: 9, Ch11: 10, Ch12: 11,
  Ch13: 12, Ch14: 13, Ch15: 14, Ch16: 15, AuxL: 16, AuxR: 17, Fx1L: 18, Fx1R: 19, Fx2L: 20, Fx2R: 21, Fx3L: 22, Fx3R: 23,
  Fx4L: 24, Fx4R: 25, Bus1: 26, Bus2: 27, Bus3: 28, Bus4: 29, Bus5: 30, Bus6: 31, Send1: 32, Send2: 33, Send3: 34,
  Send4: 35, L: 36, R: 37, U01: 38, U02: 39, U03: 40, U04: 41, U05: 42, U06: 43, U07: 44, U08: 45, U09: 46, U10: 47,
  U11: 48, U12: 49, U13: 50, U14: 51, U15: 52, U16: 53, U17: 54, U18: 55,
} as const, undefined, false);
export type AuxSrc = EnumType<typeof AuxSrc>;


export const UsbSrc = createEnum({
  Ch01: 0, Ch02: 1, Ch03: 2, Ch04: 3, Ch05: 4, Ch06: 5, Ch07: 6, Ch08: 7, Ch09: 8, Ch10: 9, Ch11: 10, Ch12: 11,
  Ch13: 12, Ch14: 13, Ch15: 14, Ch16: 15, AuxL: 16, AuxR: 17, Fx1L: 18, Fx1R: 19, Fx2L: 20, Fx2R: 21, Fx3L: 22, Fx3R: 23,
  Fx4L: 24, Fx4R: 25, Bus1: 26, Bus2: 27, Bus3: 28, Bus4: 29, Bus5: 30, Bus6: 31, Send1: 32, Send2: 33, Send3: 34,
  Send4: 35, L: 36, R: 37,
} as const, undefined, false);
export type UsbSrc = EnumType<typeof UsbSrc>;


export const Tap = createEnum(
  {
    AnalogIn: 0, AnalogInMute: 1, Input: 2, InputMute: 3, PreEq: 4, PreEqMute: 5, PostEq: 6, PostEqMute: 7, PreFader: 8,
    PreFaderMute: 9, PostFader: 10,
  } as const,
  [
    'AIN', 'AIN+M', 'IN', 'IN+M', 'PREEQ', 'PREEQ+M', 'POSTEQ', 'POSTEQ+M', 'PRE', 'PRE+M', 'POST',
  ],
);
export type Tap = EnumType<typeof Tap>;


