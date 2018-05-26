const wrap = require('./index')

it('returns function', () => {
	expect(typeof wrap()).toBe('function')
})
