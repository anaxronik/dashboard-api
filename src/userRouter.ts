import { Router } from 'express';

export const userRouter = Router();
userRouter.get('/user', (req, res) => {
	res.send('aaa');
});
