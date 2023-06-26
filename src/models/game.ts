import { BaseMission, Mission } from './mission';

export interface BaseGame {
    name: string;
    description: string;
    missions: BaseMission[] | Mission[];
}

export interface Game extends BaseGame {
    id: string;
}