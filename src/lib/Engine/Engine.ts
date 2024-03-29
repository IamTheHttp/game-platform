class Engine {
  systems: Array<(systemArguments: Record<string, any>) => void>;
  frameID: number;
  constructor() {
    this.systems = [];
    this.frameID = null;
  }

  addSystem(system: (sysArgs: Record<string, any>) => void): void {
    this.systems.push(system);
  }

  run(sysArgs: any): number {
    this.frameID = requestAnimationFrame(() => {
      this.run(sysArgs); // // Load the next frame request, this will allow any system to cancel the frame
      let normalizedSysArgs = typeof sysArgs === 'function' ? sysArgs() : sysArgs;

      this.runSystems(normalizedSysArgs);
    });

    return this.frameID;
  }

  runSystems(sysArgs: Record<string, any>) {
    for (let i = 0; i < this.systems.length; i++) {
      this.systems[i](sysArgs);
    }
  }

  stop(): number {
    cancelAnimationFrame(this.frameID);
    return this.frameID;
  }
}

export default Engine;
