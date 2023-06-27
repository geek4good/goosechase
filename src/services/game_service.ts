import { v4 as uuid } from 'uuid';
import { BaseGame, Game } from '../models/game';
import { BaseMission, Mission } from '../models/mission';
import { GameRepository } from '../repositories/game_repository';

const gameRepo = new GameRepository();

const initializeGame = (newGame: BaseGame): Game => {
    const id = uuid();
    const game: Game = {
        id,
        ...newGame,
    };

    return game;
}

const initializeMission = (newMission: BaseMission): Mission => {
    const id = uuid();
    const mission: Mission = {
        id,
        ...newMission,
    };

    return mission;
}

const storeGame = async (game: Game): Promise<void> => {
    await gameRepo.store(game);
}

const storeMission = async (mission: Mission): Promise<void> => {
    await gameRepo.storeMission(mission);
}

export const createGame = async (newGame: BaseGame): Promise<Game> => {
    const game = initializeGame(newGame);
    await storeGame(game);

    return game;
};

export const listGames = async (): Promise<Game[]> => {
    const games: Game[] = await gameRepo.all();

    return games;
}

export const getGame = async (gid: string): Promise<Game> => {
    const game: Game = await gameRepo.findGame(gid);

    return game;
}

export const listMissions = async (gid: string): Promise<Mission[]> => {
    const missions: Mission[] = await gameRepo.findMissionsByGame(gid);

    return missions;
}

export const getMission = async (gid: string, mid: string): Promise<Mission> => {
    const mission: Mission = await gameRepo.findMissionByGame(gid, mid);

    return mission;
}

export const createMission = async (newMission: BaseMission): Promise<Mission> => {
    const mission = initializeMission(newMission);
    await storeMission(mission);

    return mission;
};