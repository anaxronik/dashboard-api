import { Container } from 'inversify';
import 'reflect-metadata';

import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';

function main() {
	const appContainer = new Container();
	appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
	appContainer.bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	appContainer.bind<UserController>(TYPES.UserController).to(UserController);
	appContainer.bind<App>(TYPES.Application).to(App);
	const app = appContainer.get<App>(TYPES.Application);
	// const exc = appContainer.get<ExceptionFilter>(TYPES.ExceptionFilter);
	// console.log(exc);

	// const app = container.get<App>(TYPES.Application);
	// console.log(app);
	app.init();

	// app.init();
	return { appContainer, app };
}

export const { app, appContainer } = main();
