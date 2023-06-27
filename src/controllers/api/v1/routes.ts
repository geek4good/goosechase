import { Router } from 'express';
import * as gamesController from './games_controller';

const routes = Router();
routes.post('/games', gamesController.createGame);
routes.get('/games', gamesController.listGames);
routes.get('/games/:gid', gamesController.showGame);
routes.get('/games/:gid/missions', gamesController.listMissions);
routes.get('/games/:gid/missions/:mid', gamesController.getMission);
routes.post('/games/:gid/missions', gamesController.createMission);

export default routes;