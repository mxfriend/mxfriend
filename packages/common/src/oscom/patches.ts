import { $Buffer, BufferInterface, Cursor } from '@mxfriend/osc';
import {
  Container,
  EnumValue,
  FloatValue,
  IntValue,
  NumericValue,
  ScaledValue,
  StringValue,
} from '@mxfriend/oscom';
import { intFromBatchBlob, intToBatchBlob } from './utils';



Container.prototype.$getNodeProperties = function $getNodeProperties(this: Container): (string | number)[] {
  return this.$getCallableProperties();
};


NumericValue.prototype.$parse = function $parse(this: NumericValue, value: string): number {
  return this.$type === 'i' ? parseInt(value, 10) : parseFloat(value);
};

NumericValue.prototype.$format = function $format(this: NumericValue, value: number): string {
  return value.toString();
};

NumericValue.prototype.$fromText = function $fromText(this: NumericValue, value: string, local: boolean = true): void {
  this.$set(this.$parse(value), local);
};

NumericValue.prototype.$toText = function $toText(this: NumericValue): string | undefined {
  try {
    const value = this.$get();
    return value === undefined ? undefined : this.$format(value);
  } catch (e) {
    console.log(this.$address);
    throw e;
  }
};

NumericValue.prototype.$setTextFormat = function $setTextFormat(format: (value: number) => string, parse?: (value: string) => number): void {
  this.$format = format;
  parse && (this.$parse = parse);
};



IntValue.prototype.$fromBatchBlob = intFromBatchBlob;
IntValue.prototype.$toBatchBlob = intToBatchBlob;



FloatValue.prototype.$fromBatchBlob = function $fromBatchBlob(blob: BufferInterface, cursor: Cursor, local: boolean = false, peer?: unknown): void {
  this.$set(blob.readFloatLE(cursor.inc(4)), local, peer);
};

FloatValue.prototype.$toBatchBlob = function $toBatchBlob(): BufferInterface {
  const blob = $Buffer.allocUnsafe(4);
  blob.writeFloatLE(this.$get() ?? 0, 0);
  return blob;
};




ScaledValue.prototype.$fromText = function $fromText(this: ScaledValue, value: string, local: boolean = true): void {
  this.$fromValue(this.$parse(value), local);
};

ScaledValue.prototype.$toText = function $toText(): string | undefined {
  const value = this.$toValue();
  return value === undefined ? undefined : this.$format(value);
};



EnumValue.prototype.$fromText = function $fromText(this: EnumValue<number>, arg: string, local: boolean = true): void {
  try {
    this.$fromValue(arg, local);
  } catch (e) {
    if (/^\d+$/.test(arg)) {
      this.$set(parseInt(arg, 10), local);
    } else {
      console.log(this.$address, arg);
      throw e;
    }
  }
};

EnumValue.prototype.$toText = function $toText(this: EnumValue<number>): string | undefined {
  return this.$toValue();
};

EnumValue.prototype.$fromBatchBlob = intFromBatchBlob;
EnumValue.prototype.$toBatchBlob = intToBatchBlob;




StringValue.prototype.$fromText = function $fromText(this: StringValue, value: string, local: boolean = true): void {
  this.$set(value.replace(/^"(.*)"$/, '$1'), local);
};

StringValue.prototype.$toText = function $toText(this: StringValue): string | undefined {
  const value = this.$get();
  return value === undefined ? undefined : `"${value}"`;
};

StringValue.prototype.$fromBatchBlob = function $fromBatchBlob(this: StringValue, blob: BufferInterface, cursor: Cursor, local: boolean = false, peer?: unknown): void {
  const start = cursor.inc(32);
  let end = start;

  for (; end < start + 32; ++end) {
    if (blob[end] === 0) {
      break;
    }
  }

  this.$set(blob.subarray(start, end).toString('ascii'), local, peer);
};

StringValue.prototype.$toBatchBlob = function $toBatchBlob(this: StringValue): BufferInterface {
  const value = this.$get() ?? '';
  const blob = $Buffer.allocUnsafe(32);
  blob.write(value, 'ascii');
  value.length < 32 && blob.set(new Uint8Array(32 - value.length), value.length);
  return blob;
};

