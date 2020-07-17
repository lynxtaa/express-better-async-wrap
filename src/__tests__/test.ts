import { wrap } from '../index'

it("throws if decorated function doesn't return a promise", () => {
	expect(() => wrap(jest.fn())(1, 2, 3)).toThrow("Cannot read property 'then'")
})

it('passes Request, Response and Next to wrapped route handler', async () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn = jest.fn((req, res, next) => Promise.resolve(undefined))

	await wrap(fn)('request', 'response', 'next')

	expect(fn).toHaveBeenCalledWith('request', 'response', 'next')
	expect(fn).toHaveBeenCalledTimes(1)
})

it('passes Error, Request, Response and Next to wrapped error handler', async () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn = jest.fn((err, req, res, next) => Promise.resolve(undefined))

	await wrap(fn)('error', 'request', 'response', 'next')

	expect(fn).toHaveBeenCalledWith('error', 'request', 'response', 'next')
	expect(fn).toHaveBeenCalledTimes(1)
})

it('calls response.send with resolved data if data IS NOT undefined', async () => {
	const data = {}
	const res = { send: jest.fn() }
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn = (req: any, res: any, next: any) => Promise.resolve(data)

	await wrap(fn)(null, res, null)

	expect(res.send).toHaveBeenCalledWith(data)
	expect(res.send).toHaveBeenCalledTimes(1)
})

it("doesn't call response.send if resolved data IS undefined", async () => {
	const res = { send: jest.fn() }
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn = (req: any, res: any, next: any) => Promise.resolve()

	await wrap(fn)(null, res, null)

	expect(res.send).not.toHaveBeenCalled()
})

it('calls "next" on async errors in route handlers', async () => {
	const error = new Error('Test')
	const next = jest.fn()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn = (req: any, res: any, next: any) => Promise.reject(error)

	await wrap(fn)(null, null, next)

	expect(next).toHaveBeenCalledWith(error)
	expect(next).toHaveBeenCalledTimes(1)
})

it('calls "next" on async errors in error handlers', async () => {
	const error = new Error('Test')
	const next = jest.fn()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn = (err: any, req: any, res: any, next: any) => Promise.reject(error)

	await wrap(fn)(null, null, null, next)

	expect(next).toHaveBeenCalledWith(error)
	expect(next).toHaveBeenCalledTimes(1)
})
