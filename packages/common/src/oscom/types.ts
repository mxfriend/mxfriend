import { BufferInterface, Cursor } from '@mxfriend/osc';
import { Node } from '@mxfriend/oscom';

export interface BatchCapableNode extends Node {
  $fromBatchBlob(blob: BufferInterface, cursor: Cursor, local?: boolean, peer?: unknown): void;
  $toBatchBlob(): BufferInterface;
}

export function isBatchCapable(node: Node): node is BatchCapableNode {
  return '$fromBatchBlob' in node && typeof node.$fromBatchBlob === 'function';
}
