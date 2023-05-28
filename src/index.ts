import express from 'express';

const HOST = '127.0.0.1';
const PORT = '8007';

const app = express();
app.all(
	'*',
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		console.log('midleware');
		next();
	},
);
app.get('/hello', (req: express.Request, res: express.Response) => {
	res.send('kkkk');
});

app.listen(PORT, () => {
	console.log(`Server start on port: ${PORT}`);
});
