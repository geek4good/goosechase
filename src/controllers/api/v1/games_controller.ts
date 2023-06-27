import { Request, Response } from 'express';

import { BaseGame, Game } from '../../../models/game';
import { BaseMission, Mission } from '../../../models/mission';
import * as gameService from '../../../services/game_service';

export const createGame = async (req: Request, res: Response) => {
    try {
        const newGame: BaseGame = req.body;
        const game = await gameService.createGame(newGame);

        return res.status(201).json({
            game,
            message: 'New game created'
        });
    } catch(e) {
        console.log(`Error: ${(e as Error).message}`);
        res.status(500).send((e as Error).message);
    }
};

export const listGames = async (req: Request, res: Response) => {
    try {
        const games: Game[] = await gameService.listGames();

        return res.status(200).json({
            games,
            message: 'All games retrieved'
        });
    } catch(e) {
        res.status(500).send((e as Error).message);
    }
}

export const showGame = async (req: Request, res: Response) => {
    try {
        const game: Game = await gameService.getGame(req.params.gid);

        return res.status(200).json({
            game,
            message: 'Game details retrieved'
        });
    } catch(e) {
        res.status(500).send((e as Error).message);
    }
}

export const listMissions = async (req: Request, res: Response) => {
    try {
        const missions: Mission[] = await gameService.listMissions(req.params.gid);

        return res.status(200).json({
            missions,
            message: 'All missions for game retrieved'
        });
    } catch(e) {
        res.status(500).send((e as Error).message);
    }
}

export const getMission = async (req: Request, res: Response) => {
    try {
        const mission: Mission = await gameService.getMission(req.params.gid, req.params.mid);

        return res.status(200).json({
            mission,
            message: 'Mission details retrieved'
        });
    } catch(e) {
        res.status(500).send((e as Error).message);
    }
}

export const createMission = async (req: Request, res: Response) => {
    try {
        const newMission: BaseMission = req.body;
        const mission = await gameService.createMission(newMission);

        return res.status(201).json({
            mission,
            message: 'New mission created'
        });
    } catch(e) {
        console.log(`ERROR: ${(e as Error).message}`);
        res.status(500).send((e as Error).message);
    }
};