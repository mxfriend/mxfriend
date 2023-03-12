export type SceneOptions = {
  name: string;
  note?: string;
  safes?: number;
};

export type SnippetOptions = {
  name: string;
  eventtyp: number;
  channels: number;
  auxbuses: number;
  maingrps: number;
};

export type NumericProp<T> = string & keyof {
  [K in keyof T as T[K] extends number | undefined ? K : never]: T[K];
};
