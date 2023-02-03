/**
 * Frequency:
 *  - 1 <= frequency <= 20 -> hz (how many times per second do I want an update)
 *  - 0.05 < frequency < 1 -> seconds (how much time should pass between updates, e.g. 0.5 for 500ms)
 */
export function frequencyToTf(frequency: number): number {
  if (frequency <= 0.05 || frequency > 20) {
    throw new RangeError(`Invalid frequency: '${frequency}', must be > 0 and <= 20`);
  } else if (frequency >= 1) {
    frequency = 1 / frequency; // hz to seconds
  }

  return Math.round(frequency / 0.05);
}

export function tfToFrequency(tf: number): number {
  return 0.05 / tf;
}


export async function sleep(n: number): Promise<void> {
  return new Promise((r) => setTimeout(r, n));
}
