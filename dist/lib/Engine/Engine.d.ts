declare class Engine {
    systems: Array<(systemArguments: Record<string, any>) => void>;
    frameID: number;
    constructor();
    addSystem(system: (sysArgs: Record<string, any>) => void): void;
    run(sysArgs: any): number;
    runSystems(sysArgs: Record<string, any>): void;
    stop(): number;
}
export default Engine;
