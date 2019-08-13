module.exports = function(config){
  config.resolve = {
    modules: ["./src", "node_modules"]
  };

  let plugins = [];
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name !== 'UglifyJsPlugin') {
      plugins.push(plugin);
    }
  });
  
  if (process.env.NODE_ENV !== 'develop') {
    config.externals = {
      'react': 'react'
    };
  }

  config.plugins = plugins;
  return config;
};