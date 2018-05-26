const symbol = Symbol('Wrap customizer')

const isErrorHandler = fn => fn.length > 3

module.exports = function(fn) {
  const wrapped = isErrorHandler(fn)
    ? (err, req, res, next) =>
        fn(err, req, res, next)
          .then(data => data !== undefined && wrapped[symbol](err, req, res, next)(data))
          .catch(next)
    : (req, res, next) =>
        fn(req, res, next)
          .then(data => data !== undefined && wrapped[symbol](req, res, next)(data))
          .catch(next)

  wrapped[symbol] = (...args) => data =>
    (isErrorHandler(fn) ? args[2] : args[1]).send(data)

  return wrapped
}

module.exports.custom = symbol
