const symbol = Symbol('Wrap customizer')

const isErrorHandler = fn => fn.length > 3

function wrap(fn) {
	const wrapped = (...args) =>
		fn(...args)
			.then(data => data !== undefined && wrapped[symbol](...args)(data))
			.catch(isErrorHandler(fn) ? args[3] : args[2])

	wrapped[symbol] = (...args) => data =>
		(isErrorHandler(fn) ? args[2] : args[1]).send(data)

	return wrapped
}

wrap.custom = symbol

module.exports = wrap
