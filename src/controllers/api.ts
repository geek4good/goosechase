import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import v1Routes from './api/v1/routes';

const api = express();

// Configure middleware
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

// Configure routes
api.use('/api/v1', v1Routes);

export default api;