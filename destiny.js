module.exports = destiny

var priority = ['text', 'text/plain', 'html', 'text/html', 'default']
function isStr(obj) { return 'string' === typeof obj }
function isObj(obj) { return 'object' === typeof obj }
function isFunc(obj) { return 'function' === typeof obj }

function copy(b, a) {
  return Object.keys(a).reduce(function (b, k) {
    b[k] = a[k]
    return b
  }, b)
}

function defaultHandle(req, res, next) { next() }
function noDefault(opts) { return opts.default !== false }

function organiseconfig(config, opts) {
  config = copy({}, config)
  var ret = priority.reduce(function (opts, key) {
    if (config[key]) {
      opts[key] = config[key]
      delete config[key]
    }
    return opts
  }, {})

  if (!Object.keys(ret).length && noDefault(opts))
    config.default = defaultHandle

  return copy(ret, config)
}

function isPriority(key) {
  return priority.some(function (k) { return key === k })
}

function addDefault(key, opts) {
  return !isPriority(key) && (!isObj(opts) || noDefault(opts))
}

function handleArgs(args) {
  var config = {};

  if (isObj(args[0]))
    return organiseconfig(args[0], isObj(args[1]) ? args[1] : {})

  var key = args[0]
  if (isStr(key) && isFunc(args[1])) {
    if (addDefault(key, args[2]))
      config.default = defaultHandle

    config[args[0]] = args[1]

    return config
  }
}

function destiny() {
  var config = handleArgs(arguments)
  return function expressDestiny(req, res, next) {
    config ? res.format(config) : next()
  }
}
