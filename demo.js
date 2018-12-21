const consol = require('./index');

consol.log('logg');
consol.log('logg');

consol.log('several\nlines', 'in\nthis');

consol.error('this is an error');
consol.trace('this is a a trace');

consol.log('global coming up');

require('./global');

console.log('global log');
console.warn('global warn');
