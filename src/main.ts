import { Container } from 'inversify';
import 'reflect-metadata';

import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { UserService } from './users/users.service';

function main() {
	const appContainer = new Container();
	const arr = [
		{ symbol: TYPES.ILogger, to: LoggerService },
		{ symbol: TYPES.ExceptionFilter, to: ExceptionFilter },
		{ symbol: TYPES.UserController, to: UserController },
		{ symbol: TYPES.Application, to: App },
		{ symbol: TYPES.UserService, to: UserService },
	];
	arr.forEach((i) => {
		appContainer.bind(i.symbol).to(i.to);
	});
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { appContainer, app };
}

export const { app, appContainer } = main();
