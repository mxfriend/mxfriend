import { OSCArgument, OSCArray, OSCBundle, OSCMessage, isMessage } from './types';
import { OSCColorValue, OSCMIDIValue } from './values';

const BUNDLE_TAG = '#bundle';
type Cursor = { index: number };

function scanstr(packet: Buffer, cursor: Cursor): string {
  const start = cursor.index;

  for (; cursor.index < packet.length; ++cursor.index) {
    if (packet[cursor.index] === 0) {
      const str = packet.slice(start, cursor.index).toString('ascii');
      cursor.index += 4 - cursor.index % 4;
      return str;
    }
  }

  return packet.slice(start).toString('ascii');
}

function scanblob(packet: Buffer, cursor: Cursor): Buffer {
  const length = packet.readInt32BE(cursor.index);
  const buf = packet.slice(cursor.index + 4, cursor.index + 4 + length);
  cursor.index += 4 + length;
  return buf;
}

export function decode(packet: Buffer): ['bundle', OSCBundle] | ['message', OSCMessage] {
  const cursor: Cursor = { index: 0 };
  const address: string = scanstr(packet, cursor);

  if (address === BUNDLE_TAG) {
    return ['bundle', decodeBundle(packet, cursor)];
  } else {
    return ['message', decodeMessage(packet, address, cursor)];
  }
}

function decodeBundle(packet: Buffer, cursor: Cursor): OSCBundle {
  const elements: (OSCBundle | OSCMessage)[] = [];
  const timetag = packet.readBigInt64BE(cursor.index);
  cursor.index += 8;

  while (cursor.index < packet.byteLength) {
    const [, element] = decode(scanblob(packet, cursor));
    elements.push(element);
  }

  return { elements, timetag };
}

function decodeMessage(packet: Buffer, address: string, cursor: Cursor): OSCMessage {
  const args: OSCArgument[] = [];

  if (cursor.index >= packet.byteLength || packet[cursor.index] !== 0x2c) { // ","
    return { address, args };
  }

  ++cursor.index;
  const types = scanstr(packet, cursor);
  const stack: OSCArgument[][] = [];
  let arr: OSCArgument[] = args;

  for (let i = 0; i < types.length; ++i) {
    switch (types[i]) {
      case 'i':
        arr.push({ type: 'i', value: packet.readInt32BE(cursor.index) });
        cursor.index += 4;
        break;
      case 'f':
        arr.push({ type: 'f', value: packet.readFloatBE(cursor.index) });
        cursor.index += 4;
        break;
      case 's':
      case 'S':
        arr.push({ type: types[i] as any, value: scanstr(packet, cursor) });
        break;
      case 'b':
        arr.push({ type: 'b', value: scanblob(packet, cursor) });
        break;
      case 'h':
      case 't':
        arr.push({ type: types[i] as any, value: packet.readBigInt64BE(cursor.index) });
        cursor.index += 8;
        break;
      case 'd':
        arr.push({ type: 'd', value: packet.readDoubleBE(cursor.index) });
        cursor.index += 8;
        break;
      case 'c':
        arr.push({ type: 'c', value: String.fromCharCode(packet.readUint8(cursor.index + 3)) });
        cursor.index += 4;
        break;
      case 'r':
        arr.push({ type: 'r', value: new OSCColorValue(packet.readUint32BE(cursor.index)) });
        cursor.index += 4;
        break;
      case 'm':
        arr.push({ type: 'm', value: new OSCMIDIValue(packet.readUint32BE(cursor.index)) });
        cursor.index += 4;
        break;
      case 'T':
        arr.push({ type: 'B', value: true });
        break;
      case 'F':
        arr.push({ type: 'B', value: false });
        break;
      case 'N':
        arr.push({ type: 'N', value: null });
        break;
      case 'I':
        arr.push({ type: 'I', value: Infinity });
        break;
      case '[': {
        const arg: OSCArray = { type: 'a', value: [] };
        arr.push(arg);
        stack.push(arr);
        arr = arg.value;
        break;
      }
      case ']': {
        const prev = stack.shift();

        if (prev) {
          arr = prev;
        } else {
          throw new Error("Mismatched ']' in OSC type tag list");
        }
        break;
      }
      default:
        throw new Error(`Unknown OSC type: '${types[i]}'`);
    }
  }

  if (stack.length) {
    throw new Error("Mismatched '[' in OSC type tag list");
  }

  return { address, args };
}

function writestr(str: string): Buffer {
  return Buffer.from(str.concat('\0').padEnd(4 * Math.ceil((str.length + 1) / 4), '\0'));
}

function writeblob(blob: Buffer): Buffer {
  const buf = Buffer.alloc(blob.byteLength + 4);
  buf.writeInt32BE(blob.byteLength);
  buf.set(blob, 4);
  return buf;
}

function writeint(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeInt32BE(value);
  return buf;
}

function writefloat(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeFloatBE(value);
  return buf;
}

function writebigint(value: bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(value);
  return buf;
}

function writedouble(value: number): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeDoubleBE(value);
  return buf;
}

function writechar(value: string): Buffer {
  const c = value.charCodeAt(0);

  if (c > 127) {
    throw new Error(`Character '${value}' is outside ASCII range`);
  }

  const buf = Buffer.alloc(4);
  buf.writeUInt8(c, 3);
  return buf;
}

function writeuint(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUint32BE(value);
  return buf;
}

function writearg(arg: OSCArgument): Buffer | null {
  switch (arg.type) {
    case 'i': return writeint(arg.value);
    case 'f': return writefloat(arg.value);
    case 's':
    case 'S':
      return writestr(arg.value);
    case 'b':
      return writeblob(arg.value);
    case 'h':
    case 't':
      return writebigint(arg.value);
    case 'd':
      return writedouble(arg.value);
    case 'c':
      return writechar(arg.value);
    case 'r':
    case 'm':
      return writeuint(arg.value.valueOf());
    case 'B':
    case 'N':
    case 'I':
      return null;
    case 'a':
      return Buffer.concat(arg.value.map(writearg).filter(nonempty));
    default:
      throw new TypeError(`Unknown OSC type: '${(arg as any).type}'`);
  }
}

function writetype(arg: OSCArgument): string {
  switch (arg.type) {
    case 'B': return arg.value ? 'T' : 'F';
    case 'a': return '[' + arg.value.map(writetype).join('') + ']';
    default: return arg.type;
  }
}

function nonempty<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function encodeMessage(message: OSCMessage): Buffer {
  if (!message.args.length) {
    return writestr(message.address);
  }

  return Buffer.concat([
    writestr(message.address),
    writestr(',' + message.args.map(writetype).join('')),
    ...message.args.map(writearg).filter(nonempty),
  ]);
}

function encodeBundleElement(element: OSCMessage | OSCBundle): Buffer[] {
  const data = isMessage(element) ? encodeMessage(element) : encodeBundle(element);
  return [writeint(data.byteLength), data];
}

export function encodeBundle(bundle: OSCBundle): Buffer {
  return Buffer.concat([
    writestr(BUNDLE_TAG),
    writebigint(bundle.timetag),
    ...bundle.elements.flatMap(encodeBundleElement),
  ]);
}
