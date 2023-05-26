
export type Ref<T> = T extends undefined | null | boolean | number | string | BigInt ? { value: T } : T;

export const clamp = (value: number, lower: number, upper: number) => value < lower ? lower : value > upper ? upper : value;

export const range = (first: number, last: number, interval = 1): number[] => first > last ? [] : [...range(first + interval, last, interval), first];

