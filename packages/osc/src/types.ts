import { OSCColorValue, OSCMIDIValue } from './values';

export type OSCInt = {
  type: 'i';
  value: number;
};

export type OSCFloat = {
  type: 'f';
  value: number;
};

export type OSCString = {
  type: 's';
  value: string;
};

export type OSCBlob = {
  type: 'b';
  value: Buffer;
};

export type OSCBigInt = {
  type: 'h';
  value: bigint;
};

export type OSCTimeTag = {
  type: 't';
  value: bigint;
};

export type OSCDouble = {
  type: 'd';
  value: number;
};

export type OSCSymbol = {
  type: 'S';
  value: string;
};

export type OSCChar = {
  type: 'c';
  value: string;
};

export type OSCColor = {
  type: 'r';
  value: OSCColorValue;
};

export type OSCMIDI = {
  type: 'm';
  value: OSCMIDIValue;
};

export type OSCBool = {
  type: 'B';
  value: boolean;
};

export type OSCNull = {
  type: 'N';
  value: null;
};

export type OSCInfinity = {
  type: 'I';
  value: number;
};

export type OSCArray = {
  type: 'a';
  value: OSCArgument[];
};

export type OSCType = 'i' | 'f' | 's' | 'b' | 'h' | 't' | 'd' | 'S' | 'c' | 'r' | 'm' | 'B' | 'N' | 'I' | 'a';
export type OSCArgument =
  | OSCInt
  | OSCFloat
  | OSCString
  | OSCBlob
  | OSCBigInt
  | OSCTimeTag
  | OSCDouble
  | OSCSymbol
  | OSCChar
  | OSCColor
  | OSCMIDI
  | OSCBool
  | OSCNull
  | OSCInfinity
  | OSCArray;

export type OSCMessage = {
  address: string;
  args: OSCArgument[];
};

export type OSCBundle = {
  elements: (OSCMessage | OSCBundle)[];
  timetag: bigint;
};

export function isMessage(value: OSCMessage | OSCBundle): value is OSCMessage {
  return value && typeof (value as any).address === 'string';
}

export function isBundle(value: OSCMessage | OSCBundle): value is OSCBundle {
  return value && Array.isArray((value as any).elements);
}

export type OSCArgumentOfType<T extends OSCType> =
  | (T extends 'i' ? OSCInt : never)
  | (T extends 'f' ? OSCFloat : never)
  | (T extends 's' ? OSCString : never)
  | (T extends 'b' ? OSCBlob : never)
  | (T extends 'h' ? OSCBigInt : never)
  | (T extends 't' ? OSCTimeTag : never)
  | (T extends 'd' ? OSCDouble : never)
  | (T extends 'S' ? OSCSymbol : never)
  | (T extends 'c' ? OSCChar : never)
  | (T extends 'r' ? OSCColor : never)
  | (T extends 'm' ? OSCMIDI : never)
  | (T extends 'B' ? OSCBool : never)
  | (T extends 'N' ? OSCNull : never)
  | (T extends 'I' ? OSCInfinity : never)
  | (T extends 'a' ? OSCArray : never);


export function isOSCType<T extends OSCType>(arg: OSCArgument, type: T): arg is OSCArgumentOfType<T> {
  return arg && arg.type === type;
}

export function isAnyOSCType<T extends OSCType>(arg: OSCArgument, ...types: T[]): arg is OSCArgumentOfType<T> {
  return arg && types.includes(arg.type as any);
}


export function assertOSCType<T extends OSCType>(arg: OSCArgument, type: T): asserts arg is OSCArgumentOfType<T> {
  if (!isOSCType(arg, type)) {
    throw new TypeError(`Unexpected OSC value type "${arg.type}", expected "${type}"`);
  }
}

export function assertAnyOSCType<T extends OSCType>(arg: OSCArgument, ...types: T[]): asserts arg is OSCArgumentOfType<T> {
  if (!isAnyOSCType(arg, ...types)) {
    const expected = types.length > 1 ? `${types.slice(0, -1).join(`", "`)}" or "${types.slice(-1)}` : types[0];
    throw new TypeError(`Unexpected OSC value type "${arg.type}", expected "${expected}"`);
  }
}
