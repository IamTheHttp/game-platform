module.exports = function (jestConfig) {
  //collectCoverageFrom is already an array in the default configuration we use, but it's always safe to ensure it exists beforehand
  if (!jestConfig.collectCoverageFrom) {
    jestConfig.collectCoverageFrom = [];
  }

  //let's prevent Jest from collecting code coverage from the examples directory - we don't plan on testing it anyway.
  jestConfig.collectCoverageFrom.push("src/**/*.{ts,tsx}");
  jestConfig.collectCoverageFrom.push("!src/polyfill/*.*");
  jestConfig.collectCoverageFrom.push("!src/develop.tsx");
  jestConfig.collectCoverageFrom.push("!src/index.ts");
  jestConfig.collectCoverageFrom.push("!src/levels/*.*");

  jestConfig.setupFiles = jestConfig.setupFiles || [];
  jestConfig.setupFiles.push("<rootDir>/src/polyfill/rAF.ts");
  jestConfig.setupFiles.push("jest-canvas-mock");

  jestConfig.testRegex = "test.ts$";
  jestConfig.preset = 'ts-jest';
  jestConfig.bail = true;
  jestConfig.coverageThreshold.global = {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  };
  return jestConfig;
};