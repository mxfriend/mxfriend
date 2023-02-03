import { BufferInterface, Cursor } from '@mxfriend/osc';
import { ContainerEvents, Node, ValueEvents } from '@mxfriend/oscom';

import './patches';

export * from './decorators';
export * from './dispatcher';
export * from './meters';
export * from './values';
export * from './types';

declare module '@mxfriend/oscom' {
  export interface Container<TEvents extends ContainerEvents = ContainerEvents> extends Node<TEvents> {
    $getNodeProperties(): (string | number)[];
  }

  export interface Value<T = any, TEvents extends ValueEvents<T> = ValueEvents<T>> {
    $fromText(value: string, local?: boolean, peer?: unknown): void;
    $toText(): string | undefined;
    $fromBatchBlob(blob: BufferInterface, cursor: Cursor, local?: boolean, peer?: unknown): void;
    $toBatchBlob(): BufferInterface;
  }

  export interface NumericValue {
    $parse(value: string): number;
    $format(value: number): string;
    $setTextFormat(format: (value: number) => string, parse?: (value: string) => number): void;
  }
}
