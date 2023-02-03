import { $Buffer, BufferInterface, Cursor, osc, OSCArgument } from '@mxfriend/osc';
import { Node, NodeEvents } from '@mxfriend/oscom';
import { frequencyToTf } from '../utils';
import { BatchCapableNode } from './types';

const $ctor = Symbol('ctor');
const $header = Symbol('header');
const $data = Symbol('data');

interface Ctor<T extends Float32Array | Int16Array> {
  BYTES_PER_ELEMENT: number;

  new (src: ArrayBuffer, byteOffset?: number, length?: number): T;
  new (length?: number): T;
}

export interface MeterBankEvents<
  TData extends Float32Array | Int16Array = any,
> extends NodeEvents {
  'local-update': [data: TData, bank: AbstractMeterBank<TData>];
  'remote-update': [data: TData, bank: AbstractMeterBank<TData>, peer?: unknown];
  'local-subscribe': [args: OSCArgument[], bank: AbstractMeterBank<TData>];
  'local-unsubscribe': [bank: AbstractMeterBank<TData>];
  'remote-subscribe': [args: OSCArgument[], bank: AbstractMeterBank<TData>, peer?: unknown];
}

export abstract class AbstractMeterBank<
  TData extends Float32Array | Int16Array = any,
> extends Node<MeterBankEvents<TData>> implements BatchCapableNode {
  private readonly [$ctor]: Ctor<TData>;
  private readonly [$header]: BufferInterface;
  private [$data]: TData;

  constructor(ctor: Ctor<TData>, size: number) {
    super();
    this[$ctor] = ctor;
    this[$header] = $Buffer.allocUnsafe(4);
    this[$header].writeInt32LE(size, 0);
    this[$data] = new ctor(size);
  }

  get $callable(): boolean {
    return true;
  }

  get $size(): number {
    return this[$data].length;
  }

  $get(): TData;
  $get(idx: number): number;
  $get(idx?: number): TData | number {
    return idx === undefined ? this[$data] : this[$data][idx];
  }

  $set(data: TData, local?: boolean, peer?: unknown): void;
  $set(idx: number, value: number, local?: boolean, peer?: unknown): void;
  $set(idxOrData: TData | number, value: any, local: any, peer?: any): void {
    if (typeof idxOrData === 'number') {
      this[$data][idxOrData] = value;
    } else if (idxOrData.length === this.$size) {
      this[$data] = idxOrData;
      peer = local;
      local = value;
    } else {
      throw new TypeError('Invalid data for meter bank');
    }

    this.$emit(local ? 'local-update' : 'remote-update', this[$data], this, peer);
  }

  abstract $toDb(): number[];
  abstract $toDb(idx: number): number;

  abstract $fromDb(values: number[]): void;
  abstract $fromDb(idx: number, value: number): void;

  $fromBatchBlob(blob: BufferInterface, cursor: Cursor, local?: boolean, peer?: unknown): void {
    const blobElems = blob.readInt32LE(cursor.inc(4)) * 4 / this[$ctor].BYTES_PER_ELEMENT;

    if (blobElems === this.$size) {
      this.$set(
        new this[$ctor](blob.buffer, cursor.inc(this.$size * this[$ctor].BYTES_PER_ELEMENT), this.$size),
        local,
        peer,
      );
    }
  }

  $toBatchBlob(): BufferInterface {
    return $Buffer.concat([
      this[$header],
      new Uint8Array(this[$data].buffer, this[$data].byteOffset, this.$size * this[$ctor].BYTES_PER_ELEMENT),
    ]);
  }

  $subscribe(frequency: number = 20, arg1: number = 0, arg2: number = 0): void {
    this.$emit('local-subscribe', osc.compose('i', arg1, 'i', arg2, 'i', frequencyToTf(frequency)), this);
  }

  $unsubscribe(): void {
    this.$emit('local-unsubscribe', this);
  }

  $handleCall(peer?: unknown, ...args: OSCArgument[]): OSCArgument[] | OSCArgument | undefined {
    this.$emit('remote-subscribe', args, this, peer);
    return undefined;
  }
}

const $headroom = Symbol('headroom');

export class Int16MeterBank extends AbstractMeterBank<Int16Array> {
  private readonly [$headroom]: number;

  constructor(size: number, headroom: number = 0) {
    super(Int16Array, size);
    this[$headroom] = headroom;
  }

  $toDb(): number[];
  $toDb(idx: number): number;
  $toDb(idx?: number): number | number[] {
    return idx === undefined
      ? [...this.$get()].map((v) => this[$headroom] + v / 256)
      : (this[$headroom] + this.$get(idx) / 256);
  }

  $fromDb(values: number[], local?: boolean, peer?: unknown): void;
  $fromDb(idx: number, value: number, local?: boolean, peer?: unknown): void;
  $fromDb(idxOrValues: number | number[], value?: any, local?: any, peer?: any): void {
    if (typeof idxOrValues === 'number') {
      this.$set(idxOrValues, Math.round((value - this[$headroom]) * 256), local, peer);
    } else {
      this.$set(new Int16Array(idxOrValues.map((v) => Math.round((v - this[$headroom]) * 256))), value, local);
    }
  }
}
