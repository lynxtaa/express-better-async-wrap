import { RequestHandler, Request, Response, ErrorRequestHandler } from 'express'

export interface RouteGenericInterface {
	/** Request body */
	Body?: any
	/** Request querystring */
	Querystring?: Request['query']
	/** Request params */
	Params?: Record<string, string>
	/** Response Body */
	ResBody?: any
}

export function wrap<TRoute extends RouteGenericInterface = RouteGenericInterface>(
	handler: (
		req: Request<
			TRoute['Params'],
			TRoute['ResBody'],
			TRoute['Body'],
			TRoute['Querystring']
		>,
		res: Response<TRoute['ResBody']>,
	) => Promise<TRoute['ResBody'] | void>,
): RequestHandler<
	TRoute['Params'],
	TRoute['ResBody'],
	TRoute['Body'],
	TRoute['Querystring']
> {
	return function (req, res, next) {
		handler(req, res)
			.then((result) => {
				if (result !== undefined) {
					res.send(result)
				}
			})
			.catch(next)
	}
}

export function wrapError<TRoute extends RouteGenericInterface = RouteGenericInterface>(
	handler: (
		err: unknown,
		req: Request<
			TRoute['Params'],
			TRoute['ResBody'],
			TRoute['Body'],
			TRoute['Querystring']
		>,
		res: Response<TRoute['ResBody']>,
	) => Promise<TRoute['ResBody'] | void>,
): ErrorRequestHandler<
	TRoute['Params'],
	TRoute['ResBody'],
	TRoute['Body'],
	TRoute['Querystring']
> {
	return function (err, req, res, next) {
		handler(err, req, res)
			.then((result) => {
				if (result !== undefined) {
					res.send(result)
				}
			})
			.catch(next)
	}
}
