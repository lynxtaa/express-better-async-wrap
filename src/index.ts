import { RequestHandler, Request, Response, ErrorRequestHandler } from 'express'

interface RequestTypes {
	/** Request body */
	Body?: any
	/** Request querystring */
	Querystring?: Request['query']
	/** Request params */
	Params?: Record<string, string>
}

export function wrap<TRequestTypes extends RequestTypes = RequestTypes, ResBody = any>(
	handler: (
		req: Request<
			TRequestTypes['Params'],
			ResBody,
			TRequestTypes['Body'],
			TRequestTypes['Querystring']
		>,
		res: Response<ResBody>,
	) => Promise<ResBody | void>,
): RequestHandler<
	TRequestTypes['Params'],
	ResBody,
	TRequestTypes['Body'],
	TRequestTypes['Querystring']
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

export function wrapError<
	TRequestTypes extends RequestTypes = RequestTypes,
	ResBody = any
>(
	handler: (
		err: unknown,
		req: Request<
			TRequestTypes['Params'],
			ResBody,
			TRequestTypes['Body'],
			TRequestTypes['Querystring']
		>,
		res: Response<ResBody>,
	) => Promise<ResBody | void>,
): ErrorRequestHandler<
	TRequestTypes['Params'],
	ResBody,
	TRequestTypes['Body'],
	TRequestTypes['Querystring']
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
