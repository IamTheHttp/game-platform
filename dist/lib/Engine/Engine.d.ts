declare class Engine {
    systems: Array<(systemArguments: any) => void>;
    frameID: number;
    constructor();
    addSystem(system: (sysArgs: any) => void): void;
    run(sysArgs: any): number;
    runSystems(sysArgs: any): void;
    stop(): number;
}
export default Engine;
