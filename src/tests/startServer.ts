import { Server, createServer } from 'http'
import { promisify } from 'util'

import { Express } from 'express'
import fetch, { RequestInit, Response } from 'node-fetch'

export type AsyncServer = Omit<Server, 'close'> & {
	close: () => Promise<void>
	request: (relativeUrl: string, options?: RequestInit) => Promise<Response>
}

export default async function startServer(app: Express): Promise<AsyncServer> {
	const server = await new Promise<Server>((resolve, reject) => {
		const server = createServer(app)
		server.on('error', reject)
		server.listen(0, 'localhost', () => resolve(server))
	})

	const asyncServer = (server as unknown) as AsyncServer

	const originalClose = server.close.bind(server)
	asyncServer.close = promisify(originalClose)

	const address = asyncServer.address()

	if (!address || typeof address === 'string') {
		throw new Error(`Can't find server's port: ${address}`)
	}

	asyncServer.request = (relativeUrl, options) =>
		fetch(`http://localhost:${address.port}${relativeUrl}`, options)

	return asyncServer
}
