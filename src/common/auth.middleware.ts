import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ').pop();

			if (token) {
				jwt.verify(token, this.secret, (err, payload) => {
					if (!err && payload) {
						const email = (payload as { email: string })?.email;
						req.user = email;
						return next();
					} else {
						return next();
					}
				});
			} else {
				return next();
			}
		} else {
			return next();
		}
	}
}
