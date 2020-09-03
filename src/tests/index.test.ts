import express from 'express'

import { wrap, wrapError } from '../index'
import startServer, { AsyncServer } from './startServer'

let server: AsyncServer | null

afterEach(async () => {
	if (server) {
		await server.close()
		server = null
	}
})

it('sends resolved data if data IS defined', async () => {
	const app = express()

	app.get(
		'/user/:id',
		wrap<{
			Params: { id: string }
		}>(async (req) => ({ id: Number(req.params.id) })),
	)

	server = await startServer(app)

	const response = await server.request(`/user/10`)
	expect(response.ok).toBe(true)

	const data = await response.json()
	expect(data).toEqual({ id: 10 })
})

it('uses correct types', async () => {
	const app = express()

	app.use(express.json())

	app.post(
		'/login',
		wrap<
			{
				Querystring: { isNew?: string }
				Body: {
					login: string
					password: string
				}
			},
			{ user: { id: number } | null }
		>(async (req) => {
			if (req.body.login === 'admin' && req.body.password === '123456') {
				return { user: { id: 1 } }
			}
			return { user: null }
		}),
	)

	server = await startServer(app)

	const response = await server.request(`/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ login: 'admin', password: '123456' }),
	})
	expect(response.ok).toBe(true)

	const data = await response.json()
	expect(data).toEqual({ user: { id: 1 } })
})

it('supports manual send', async () => {
	const app = express()

	app.get(
		'/user/:id',
		wrap<{
			Params: { id: string }
		}>(async (req, res) => {
			res.send({ id: Number(req.params.id) })
		}),
	)

	server = await startServer(app)

	const response = await server.request(`/user/10`)
	expect(response.ok).toBe(true)

	const data = await response.json()
	expect(data).toEqual({ id: 10 })
})

it('handles errors', async () => {
	const app = express()

	app.get(
		'/user/:id',
		wrap(async () => {
			throw new Error('Forbidden')
		}),
	)

	server = await startServer(app)

	const response = await server.request(`/user/10`)

	expect(response.ok).toBe(false)
	expect(await response.text()).toEqual(expect.stringContaining('Forbidden'))
})

it('supports error middleware', async () => {
	const app = express()

	const error = new Error('Forbidden')

	app.get(
		'/user/:id',
		wrap(async () => {
			throw error
		}),
	)

	app.use(
		wrapError(async (err, req, res) => {
			res.status(403)
			res.send({
				statusCode: 403,
				error: (err as Error).message,
			})
		}),
	)

	server = await startServer(app)

	const response = await server.request(`/user/10`)

	expect(response.status).toBe(403)
	expect(await response.text()).toEqual(expect.stringContaining('Forbidden'))
})
