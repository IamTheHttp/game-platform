interface IStats {
    free: number;
    used: number;
}
declare class ObjectPool<T> {
    type: new () => T;
    freePool: Array<any>;
    stats: IStats;
    incrementWhenEmpty: number;
    constructor(PooledClass: new () => T, incrementWhenEmpty?: number);
    reset(): void;
    generate(amount: number): void;
    acquire(): any;
    release(object: T): void;
}
export default ObjectPool;
