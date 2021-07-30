interface IStats {
    free: number;
    used: number;
}
declare class ObjectPool {
    type: () => void;
    freePool: Array<any>;
    stats: IStats;
    incrementWhenEmpty: number;
    constructor(PooledClass: any, incrementWhenEmpty?: number);
    reset(): void;
    generate(amount: any): void;
    acquire(): any;
    release(object: any): void;
}
export default ObjectPool;
