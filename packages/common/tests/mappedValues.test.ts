import { DbMap, getValueMap } from '../src';

describe('faderMap', () => {
  const faderMap = getValueMap(DbMap, -Infinity, 10, 1024);

  // common cases include exact matches and middle float values
  // out of a list of consecutive db values - it should pass 1:1
  // both ways:
  const commonCases: [float: number, db: number][] = [
    [0, -Infinity],
    [0.0009775171056389809, -89.5],
    [0.06256109476089478, -60],
    [0.23753665387630463, -32],
    [0.32551318407058716, -24],
    [0.47507330775260925, -12],
    [0.6001955270767212, -6],
    [0.6754643321037292, -3],
    [0.7497556209564209, 0],
    [0.825024425983429, 3],
    [0.900293231010437, 6],
    [0.9755620956420898, 9],
    [1, 10],
  ];

  const floatCases: [float: number, db: number][] = [
    [-1, -Infinity], // clamp to 0..1
    [0.0002, -Infinity], // 0.0002 doesn't exist, closest is 0, which maps to -Inf
    [0.0007, -89.5], // 0.0007 doesn't exist, closest is ~0.0009, which maps to -89.5
    ...commonCases,
    [2, 10], // clamp to 0..1
  ];

  test.each(floatCases)('maps %f to %f dB', (float, db) => {
    expect(faderMap.toValue(float)).toBe(db);
  });

  const dbCases: [float: number, db: number][] = [
    [0, -140], // clamp to -90..10 -> 0..1
    [0.08699902147054672, -56], // -56 doesn't exist, closets is -56.1, which maps to this float
    ...commonCases,
    [1, 24], // clamp to -90..10 -> 0..1
  ];

  test.each(dbCases)('gets %f from %f dB', (float, db) => {
    expect(faderMap.toFloat(db)).toBe(float);
  });
});

describe('eq q factor map', () => {
  const map = getValueMap(10, 0.3, 72);

  test('maps 2.4 there and back again', () => {
    const float = map.toFloat(2.4);
    console.log(float);
    const actual = map.toValue(float);
    expect(actual).toBe(2.4);
  });
});
