const consol = require('./index');

['log', 'warn', 'error', 'trace', 'debug', 'info'].forEach(function(type) {
  var original = type === 'trace' ? console.log.bind(console) : console[type].bind(console);
  console[type] = consol.global.bind(consol, original, type);
});
