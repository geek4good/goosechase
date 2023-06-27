import { BaseMission, Mission } from './mission';

export interface BaseGame {
    name: string;
    description: string;
}

export interface Game extends BaseGame {
    id: string;
}