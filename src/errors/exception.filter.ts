import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';

@injectable()
export class ExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

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
