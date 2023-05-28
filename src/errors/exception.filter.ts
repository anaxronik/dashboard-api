import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	logger: ILogger;

	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		this.logger = logger;
	}

	catch(
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		if (err instanceof HTTPError) {
			this.logger.error(
				`[${err.context}] Ошибка ${err.statusCode} ${err.message}`,
			);
			res.status(err.statusCode);
		} else {
			this.logger.error(`${err.message}`);
			res.status(500);
		}
		res.send({ error: err.message });
	}
}
