import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import 'reflect-metadata';
import { AuthMiddleware } from './common/auth.middleware';

import { ConfigService } from '../config/config.service';
import { PrismaService } from './common/database/prisma.service';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: LoggerService,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ConfigService) private configService: ConfigService,
	) {
		this.app = express();
		this.port = process.env.PORT ? parseInt(process.env.PORT) : 8008;
	}

	useMiddleware() {
		this.app.use(bodyParser.json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes() {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server start on port: ${this.port}`);
	}
}
