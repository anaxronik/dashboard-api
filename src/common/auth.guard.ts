import { NextFunction, Request, Response } from 'express';

import { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction) {
		if (req.user) return next();
		res.status(401).send({ error: 'You are not authtorized' });
	}
}
