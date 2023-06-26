import { Request, Response } from 'express';

import { BaseGame, Game } from '../../../models/game';
import * as gameService from '../../../services/game_service';

export const createGame = async (req: Request, res: Response) => {
    try {
        const newGame: BaseGame = {
            name: req.body.name,
            description: req.body.description,
            missions: req.body.missions || [],
        };
        const game = await gameService.createGame(newGame);

        return res.status(201).json({
            game,
            message: 'New game created'
        });
    } catch (e) {
        res.status(500).send((e as Error).message);
    }
};