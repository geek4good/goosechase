import express, { Request, Response } from 'express';

const api = express();

api.get('/', (req: Request, res: Response) => {
    res.send("Hello world!")
});

export default api;