module.exports = function(config){
  config.resolve = {
    modules: ["./src", "node_modules"]
  };
  return config;
};