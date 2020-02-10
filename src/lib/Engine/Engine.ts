class Engine {
  systems: Array<(systemArguments) => void>;
  frameID: number;
  constructor() {
    this.systems = [];
    this.frameID = null;
  }

  addSystem(system) {
    this.systems.push(system);
  }

  run(sysArgs) {
    this.frameID = requestAnimationFrame(() => {
      this.run(sysArgs); // // Load the next frame request, this will allow any system to cancel the frame
      let systemArguments = typeof sysArgs === 'function' ? sysArgs() : sysArgs;

      this.runSystems(systemArguments);
    });

    return this.frameID;
  }

  runSystems(systemArguments) {
    for (let i = 0; i < this.systems.length; i++) {
      this.systems[i](systemArguments);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameID);
    return this.frameID;
  }
}


export default Engine;