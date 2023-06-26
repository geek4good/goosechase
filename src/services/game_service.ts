import { v4 as uuid } from 'uuid';
import { BaseGame, Game } from '../models/game';
import { Mission } from '../models/mission';

export const createGame = async (newGame: BaseGame): Promise<Game> => {
    const id = uuid();
    const game: Game = {
        id,
        ...newGame,
    };

    return game;
};