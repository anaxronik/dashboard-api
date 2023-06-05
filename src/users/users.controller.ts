import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserController } from './user.controller.interface';
import { IUserService } from './user.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: ConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	) {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'Пользователь не авторизован', 'login'));
		}
		const secret = String(this.configService.get('SECRET'));
		const jwt = await this.signJWT(req.body.email, secret);
		this.ok(res, { jwt });
	}

	async info(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	) {
		const email = req.user;
		const user = await this.userService.findUser(email);
		const userWithoutPassword = { ...user, password: undefined };
		this.ok(res, { ...userWithoutPassword });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	) {
		const result = await this.userService.createUser(body);
		this.loggerService.log('[UserController] new user created');
		if (!result) {
			return next(new HTTPError(422, 'User is exist'));
		}
		this.ok(res, { email: result.email, name: result.name, id: result.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			jwt.sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) reject(err);
					if (token) resolve(token as string);
				},
			);
		});
	}
}
