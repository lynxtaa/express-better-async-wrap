/* eslint-disable no-unused-vars */

const wrap = require('./index')

it('returns function', () => {
	expect(typeof wrap(jest.fn())).toBe('function')
})

it('passes Request, Responce and Next to wrapped route handler', async () => {
	const fn = jest.fn((req, res, next) => Promise.resolve(undefined))

	await wrap(fn)('request', 'responce', 'next')

	expect(fn).toHaveBeenCalledWith('request', 'responce', 'next')
	expect(fn).toHaveBeenCalledTimes(1)
})

it('passes Error, Request, Responce and Next to wrapped error handler', async () => {
	const fn = jest.fn((err, req, res, next) => Promise.resolve(undefined))

	await wrap(fn)('error', 'request', 'responce', 'next')

	expect(fn).toHaveBeenCalledWith('error', 'request', 'responce', 'next')
	expect(fn).toHaveBeenCalledTimes(1)
})

it('calls responce.send with resolved data if data IS NOT undefined', async () => {
	const data = {}
	const res = { send: jest.fn() }
	const fn = (req, res, next) => Promise.resolve(data)

	await wrap(fn)(null, res, null)

	expect(res.send).toHaveBeenCalledWith(data)
	expect(res.send).toHaveBeenCalledTimes(1)
})

it("doesn't call responce.send with resolved data if data IS undefined", async () => {
	const res = { send: jest.fn() }
	const fn = (req, res, next) => Promise.resolve()

	await wrap(fn)(null, res, null)

	expect(res.send).not.toHaveBeenCalled()
})

it('calls "next" on async errors in route handlers', async () => {
	const error = new Error('Test')
	const next = jest.fn()
	const fn = (req, res, next) => Promise.reject(error)

	await wrap(fn)(null, null, next)

	expect(next).toHaveBeenCalledWith(error)
	expect(next).toHaveBeenCalledTimes(1)
})

it('calls "next" on async errors in error handlers', async () => {
	const error = new Error('Test')
	const next = jest.fn()
	const fn = (err, req, res, next) => Promise.reject(error)

	await wrap(fn)(null, null, null, next)

	expect(next).toHaveBeenCalledWith(error)
	expect(next).toHaveBeenCalledTimes(1)
})

it('exposes symbol for customizing', () => {
	expect(typeof wrap.custom).toBe('symbol')
})

it('calls customized function if resolved data is NOT undefined', async () => {
	const data = {}
	const wrapped = wrap((req, res, next) => Promise.resolve(data))

	const customizerDataHandler = jest.fn()
	const customizer = jest.fn(() => customizerDataHandler)

	wrapped[wrap.custom] = customizer

	await wrapped('request', 'responce', 'next')

	expect(customizerDataHandler).toHaveBeenCalledWith(data)
	expect(customizer).toHaveBeenCalledWith('request', 'responce', 'next')
})
