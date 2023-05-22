
export type Ref<T> = T extends undefined | null | boolean | number | string | BigInt ? { value: T } : T;

