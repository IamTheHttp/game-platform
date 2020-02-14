module.exports = function(config){
  config.resolve.modules = ["./src", "node_modules"];

  if (config.optimization) {
    delete config.optimization.minimizer;
    config.optimization.minimize = false;
  }

  if (process.env.NODE_ENV !== 'develop') {
    config.externals = {
      'react': 'react'
    };
  }

  return config;
};