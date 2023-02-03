import { $Buffer, BufferInterface, Cursor } from '@mxfriend/osc';
import {
  toDecimalPlaces,
  toSignificantDigits,
  Value,
} from '@mxfriend/oscom';

export const intFromBatchBlob = function $fromBatchBlob(this: Value<number>, blob: BufferInterface, cursor: Cursor, local: boolean = false, peer?: unknown): void {
  this.$set(blob.readInt32LE(cursor.inc(4)), local, peer);
};

export const intToBatchBlob = function $toBatchBlob(this: Value<number>): BufferInterface {
  const blob = $Buffer.allocUnsafe(4);
  blob.writeInt32LE(this.$get() ?? 0, 0);
  return blob;
};



/**
 * Format strings: [+-][~][.]<digits>[k$]
 *   - [+-]: force sign ("+" = always, "-" = nonzero)
 *   - [~]: round
 *   - [.]: to decimal places, otherwise to significant digits
 *   - [k]: use "RKM" notation for values >= 1000
 *   - [$]: use "-oo" for -Infinity
 */
export function createFormatter(format: number | string): (value: number) => string {
  if (typeof format === 'number') {
    return (value) => toSignificantDigits(value, format);
  }

  const m = format.match(/^([-+]?)(~?)(\.?)(\d+)([k$]?)$/);

  if (!m) {
    throw new Error(`Invalid format string '${format}'`);
  }

  const [, s, r, d, n, k] = m;
  const round = !!r;
  const digits = parseInt(n, 10);
  let code = `toFormat(value, digits, round)`;
  let sgn = '';

  switch (s) {
    case '+': sgn = `(value >= 0 ? '+' : '') + `; break;
    case '-': sgn = `(value > 0 ? '+' : '') + `; break;
  }

  switch (k) {
    case '$':
      code = `value === -Infinity ? '-oo' : ` + (sgn ? `(${sgn}${code})` : code);
      break;
    case 'k':
      code = `value >= 1000 ? toFormat(value / 1000, digits + 1, true).replace(/\\.(\\d+?)0*$/, 'k$1') : ${code}`;
      sgn && (code = `${sgn}(${code})`);
      break;
    default:
      sgn && (code = `${sgn}${code}`);
      break;
  }

  return new Function('toFormat', 'digits', 'round', `return (value) => ${code};`)(
    d ? toDecimalPlaces : toSignificantDigits,
    digits,
    round
  );
}

export function createParser(format: number | string): ((value: string) => number) | undefined {
  if (typeof format === 'number') {
    return undefined;
  }

  const m = format.match(/^([-+]?)~?\.?\d+([k$]?)$/);

  if (!m) {
    throw new Error(`Invalid format string '${format}'`);
  }

  const [, s, k] = m;

  if (!s && !k) {
    return undefined;
  }

  let code = k === 'k' ? `value.replace(/k(\\d*)$/, (_, n) => n.padEnd(3, '0'))` : 'value';
  s && (code += `.replace(/^\\+/, '')`);
  code = `parseFloat(${code})`;
  k === '$' && (code = `value === '-oo' ? -Infinity : ${code}`);
  return new Function(`return (value) => ${code};`)();
}
