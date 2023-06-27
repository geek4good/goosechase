import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

import { BaseGame, Game } from '../models/game';
import { BaseMission, Mission } from '../models/mission';

export class GameRepository {
    private db: postgres.Sql

    constructor() {
        const url = process.env.DATABASE_URL;
        this.db = postgres();
    }

    async setUp() {
        if(!['development', 'test'].includes(process.env.NODE_ENV || '')) return;

        await this.db`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        await this.db`CREATE TABLE IF NOT EXISTS games ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name text NOT NULL, description text NOT NULL)`;
        await this.db`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mission_category') THEN CREATE TYPE mission_category AS ENUM ('text', 'photo+video', 'gps'); END IF; END $$;`;
        await this.db`CREATE TABLE IF NOT EXISTS missions ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name text NOT NULL, description text NOT NULL, points integer NOT NULL, category mission_category NOT NULL, game_id uuid REFERENCES games(id) NOT NULL)`;
        await this.db`CREATE INDEX IF NOT EXISTS missions_game_id_idx ON missions(game_id)`;
    }

    async seed() {
        if(!['development', 'test'].includes(process.env.NODE_ENV || '')) return;

        await this.db `INSERT INTO games (id, name, description) VALUES ( '828131e4-39b2-4a26-81de-3b21343adbb1', '5th Grade Math Fun!', 'Let''s have some fun by going on a hunt! Solve these math problems and earn points along the way!'), ( '1f5feb7a-060e-4a31-b06a-8f05244732d8', 'Toronto landmark hunt', 'This interactive quiz tour will take you to all the major landmarks and attractions the city has to offer!');`;
        await this.db `INSERT INTO missions (id, name, description, points, category, game_id) VALUES ( 'a7efbc81-9ca0-441e-8a6d-ff102a6cd457', 'Barrels on Board', 'The Mayflower was one of the largest ships of her time. It could carry about 180 large barrels on board. If The pilgrims put the barrels in 15 rows, how many barrels would have been in each row?', 100, 'text', '828131e4-39b2-4a26-81de-3b21343adbb1'), ( '8369ee88-169b-421e-a435-715164f5256b', 'If you Sailed on the Mayflower', 'Use the book "...If You Sailed on the Mayflower in 1620" or "Don''t Know Much About the Pilgrims" and find one fact that your group didn''t know and finds interesting. Make a short video explaining the fun fact.', 500, 'photo+video', '828131e4-39b2-4a26-81de-3b21343adbb1'), ( '068a8623-8391-42c0-9e9d-7091979df751', 'Groovy Potatoes', 'What good is Groovy Gravy without mashed potatoes? It takes 23 potatoes to make a batch of Grandma''s Groovy Mashed Potatoes. If there is a shipment of 3,569 potatoes, how many batches of potatoes can be made?', 200, 'text', '828131e4-39b2-4a26-81de-3b21343adbb1'), ( '98faa7b1-0129-4e4f-85ba-ff087558c394', 'The tallest tower', 'This building stands above all others downtown and gives a view for miles on its observation deck. You''ll need to get within 100m of this tower to complete this mission.', 200, 'gps', '1f5feb7a-060e-4a31-b06a-8f05244732d8'), ( 'af631732-7700-4ee5-9718-eab2e034ee27', 'Trash Pandas', 'Raccoons are some of the city''s feistiest residents! Snap a picture of an elusive trash panda to secure these points.', 1000, 'photo+video', '1f5feb7a-060e-4a31-b06a-8f05244732d8');`;
    }

    async tearDown() {
        if(!['development', 'test'].includes(process.env.NODE_ENV || '')) return;

        await this.db`DROP INDEX IF EXISTS missions_game_id_idx;`;
        await this.db`DROP TABLE IF EXISTS missions;`;
        await this.db`DROP TYPE IF EXISTS mission_category;`;
        await this.db`DROP TABLE IF EXISTS games;`;
        await this.db`DROP EXTENSION IF EXISTS "uuid-ossp";`;
    }

    async closeConnection() {
        if(!['development', 'test'].includes(process.env.NODE_ENV || '')) return;

        this.db.end();
    }

    async createGame(newGame: BaseGame): Promise<Game> {
        const [game] = await this.db<Game[]>`INSERT INTO games ${ this.db(newGame) } RETURNING *`;

        return game;
    }

    async createMission(newMission: BaseMission) {
        const [mission] = await this.db<Mission[]>`INSERT INTO missions ${ this.db(newMission) } RETURNING *;`;
        
        return mission;
    }

    async findGames() {
        const games = await this.db<Game[]>`SELECT * from games`;

        return games;
    }

    async findGame(gid: string) {
        const [game] = await this.db<Game[]>`SELECT * from games where id=${gid};`;

        return game;
    }

    async findMissionsByGame(gid: string) {
        const missions = this.db<Mission[]>`SELECT * from missions where game_id=${gid};`;

        return missions;
    }

    async findMissionByGame(gid: string, mid: string) {
        const [mission] = await this.db<Mission[]>`SELECT * from missions where id=${mid};`;

        return mission;
    }
}