import { Router } from 'express';
import * as gamesController from './games_controller';

const routes = Router();
routes.post('/games', gamesController.createGame);

export default routes;