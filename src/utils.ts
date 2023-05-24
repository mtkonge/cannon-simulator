
export type Ref<T> = T extends undefined | null | boolean | number | string | BigInt ? { value: T } : T;

export const clamp = (value: number, lower: number, upper: number) => value < lower ? lower : value > upper ? upper : value;

