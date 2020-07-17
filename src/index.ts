type ErrHandler = (err: any, req: any, res: any, next: any) => Promise<any>
type Middleware = (req: any, res: any, next: any) => Promise<any>

const isErrorHandler = (fn: ErrHandler | Middleware): fn is ErrHandler => fn.length > 3

function wrap<T1, T2, T3>(
	fn: (req: T1, res: T2, next: T3) => Promise<any>,
): (req: T1, res: T2, next: T3) => Promise<void>

function wrap<T1, T2, T3, T4>(
	fn: (err: T1, req: T2, res: T3, next: T4) => Promise<any>,
): (err: T1, req: T2, res: T3, next: T4) => Promise<void>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function wrap(fn: any) {
	return isErrorHandler(fn)
		? (err: any, req: any, res: any, next?: any) =>
				fn(err, req, res, next)
					.then((data) => {
						if (data !== undefined) {
							res.send(data)
						}
					})
					.catch(next)
		: (req: any, res: any, next: any) =>
				fn(req, res, next)
					.then((data: any) => {
						if (data !== undefined) {
							res.send(data)
						}
					})
					.catch(next)
}

export { wrap }
