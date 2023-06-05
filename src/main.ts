import { Container } from 'inversify';
import 'reflect-metadata';

import { ConfigService } from '../config/config.service';
import { App } from './app';
import { PrismaService } from './common/database/prisma.service';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';
import { UserService } from './users/users.service';

function main() {
	const appContainer = new Container();
	const arr = [
		{ symbol: TYPES.ILogger, to: LoggerService, isSingleton: true },
		{ symbol: TYPES.ExceptionFilter, to: ExceptionFilter, isSingleton: true },
		{ symbol: TYPES.UserController, to: UserController, isSingleton: true },
		{ symbol: TYPES.Application, to: App, isSingleton: true },
		{ symbol: TYPES.UserService, to: UserService, isSingleton: true },
		{ symbol: TYPES.ConfigService, to: ConfigService, isSingleton: true },
		{ symbol: TYPES.PrismaService, to: PrismaService, isSingleton: true },
		{ symbol: TYPES.UsersRepository, to: UsersRepository, isSingleton: true },
	];
	arr.forEach((i) => {
		const binder = appContainer.bind(i.symbol).to(i.to);
		if (i.isSingleton) binder.inSingletonScope();
	});
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { appContainer, app };
}

export const { app, appContainer } = main();
