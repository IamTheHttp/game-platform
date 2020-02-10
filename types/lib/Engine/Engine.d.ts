declare class Engine {
    systems: Array<(systemArguments: any) => void>;
    frameID: number;
    constructor();
    addSystem(system: any): void;
    run(sysArgs: any): number;
    runSystems(systemArguments: any): void;
    stop(): number;
}
export default Engine;
