const { inspect } = require('util');
const { EOL } = require('os');

const noop = function() {};

const types = {
  debug: 0,
  trace: 0,
  info: 1,
  log: 2,
  warn: 3,
  error: 4,
};

function applyTo(target, options = {}) {
  const { prefix, enabled = true } = options;

  function logForType(original, type, ...args) {
    if (type === 'trace') {
      args = [
        ...args,
        '\n',
        new Error().stack
          .split(/\n/g)
          .slice(1)
          .map((v, i) => (i ? v : v.slice(1)))
          .join(EOL),
      ];
    }

    const formatted = args
      .map(_ => (typeof _ === 'object' ? inspect(_) : _))
      .join(' ')
      .split(/\n/g)
      .map(line => [type.toUpperCase(), ...(prefix ? [prefix] : []), line].join(' '))
      .join(EOL);

    if (type === 'trace') {
      type = 'debug';
    }

    return original(formatted);
  }

  for (const type of Object.keys(types)) {
    if (!enabled) {
      target[type] = noop;
      continue;
    }

    var original = type === 'trace' ? console.log.bind(console) : console[type].bind(console);

    target[type] = logForType.bind(target, original, type);
  }

  target.global = function(original, type, ...args) {
    return logForType(original, type, ...args);
  };

  return target;
}

exports.filter = null;

const consol = applyTo({});

module.exports = consol;
