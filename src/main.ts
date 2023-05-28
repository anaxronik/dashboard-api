import { Container, ContainerModule, interfaces } from 'inversify';
import 'reflect-metadata';

import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';

function main() {
	const container = new Container();
	container.bind<ILogger>(TYPES.ILogger).to(LoggerService);
	container.bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	container.bind<UserController>(TYPES.ExceptionFilter).to(UserController);
	container.bind<App>(TYPES.Application).to(App);
	const app = container.get<App>(TYPES.Application);

	app.init();
	return { appContainer: container, app };
}

export const { app, appContainer } = main();
