class Engine {
  constructor() {
    this.systems = [];
    this.frameID = null;
  }

  addSystem(system) {
    this.systems.push(system);
  }

  run(sysArgs) {
    this.frameID = requestAnimationFrame(() => {
      let systemArguments = typeof sysArgs === 'function' ? sysArgs() : sysArgs;

      if (typeof systemArguments !== 'object') {
        throw 'Expecting systemArguments to be of type object';
      }

      this.runSystems(systemArguments);
      this.run(sysArgs); // the original
    });
  }

  runSystems(systemArguments) {
    for (let i = 0; i < this.systems.length; i++) {
      this.systems[i](systemArguments);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameID);
  }
}


export default Engine;