class Logger {}
Logger.prototype = {
  log  : console.log.bind(console), // eslint-disable-line
  error : console.log.bind(console, '%c %s', 'color:red;font-weight:bold'), // eslint-disable-line
  info : console.log.bind(console, '%c %s', 'color:teal') // eslint-disable-line
};
export default new Logger();