import { Response, Router } from 'express';
import { LoggerService } from '../logger/logger.service';
import { IControllerRoute } from './route.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: LoggerService) {
		this.logger = logger;
		this._router = Router();
	}

	get router() {
		return this._router;
	}

	protected bindRoutes(routes: IControllerRoute[]) {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}] ${route.path}`);
			const funcWithContext = route.func.bind(this);
			this._router[route.method](route.path, funcWithContext);
		});
	}

	public created(res: Response) {
		res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T) {
		res.status(code);
		res.type('application/json');
		res.send(message);
	}

	public ok<T>(res: Response, message: T) {
		this.send<T>(res, 200, message);
	}
}
