import { BufferInterface } from '@mxfriend/osc';
import * as data from './data';

export function getMapData(lo: number, hi: number, res: number): BufferInterface {
  const key = `log_${formatKey(lo)}_${formatKey(hi)}_${formatKey(res)}` as keyof typeof data;

  if (!data[key]) {
    throw new Error(`Unknown data map 'log ${lo}-${hi} @ ${res}`);
  }

  return data[key];
}

function formatKey(value: number): string {
  return value === -Infinity ? '_inf' : value.toString().replace('.', 'o');
}
