import { readFileSync } from 'fs';
import { join } from 'path';
import { Client, DataType } from 'ts-postgres';

import { Game } from '../models/game';
import { Mission } from '../models/mission';

export class GameRepository {
    private db: Client

    constructor() {
        const {
            DATABASE_HOST: host,
            DATABASE_PORT: port,
            DATABASE_NAME: database,
            DATABASE_USER: user,
            DATABASE_PASS: password,
        }: { [key: string]: string | undefined } = process.env;
    
        this.db = new Client({
            host,
            port: parseInt(port || '5432'),
            database,
            user,
            password,
        });
    }

    private async execQuery(sql: string, params: Array<string|number> = [], types: DataType[] = []) {
        await this.db.connect();

        try {
            const res = await this.db.query(sql, params, types);
            return res;
        } finally {
            await this.db.end();
        }
    }

    private async execMultiQuery(sql: string, env?: string[]) {
        if(env && !env.includes(process.env.NODE_ENV || '')) return;

        await this.db.connect();

        try {
            const statements = sql.split('\n');
            await Promise.all(
                statements.filter(stmt => stmt.trim() !== '')
                .map(stmt => this.db.query(stmt))
            );
        } finally {
            await this.db.end();
        }
    }

    async setUp() {
        const sql = readFileSync(join(__dirname, 'migrations', '_setup.sql'), 'utf8');
        await this.execMultiQuery(sql, ['development', 'test']);
    }

    async seed() {
        const sql = readFileSync(join(__dirname, 'migrations', '_seeds.sql'), 'utf8');
        await this.execMultiQuery(sql, ['development', 'test']);
    }

    async tearDown() {
        const sql = readFileSync(join(__dirname, 'migrations', '_teardown.sql'), 'utf8');
        await this.execMultiQuery(sql, ['development', 'test']);
    }

    async store(game: Game) {
        const sql = 'INSERT INTO games(id, name, description) VALUES ($1, $2, $3);';
        await this.execQuery(sql, [game.id, game.name, game.description]);
    }

    async storeMission(mission: Mission) {
        const sql = 'INSERT INTO missions(id, name, description, points, category, game_id) VALUES ($1, $2, $3, $4, $5, $6);';
        await this.execQuery(
            sql,
            [mission.id, mission.name, mission.description, mission.points, mission.category, mission.game_id],
            [DataType.Uuid, DataType.Text, DataType.Text, DataType.Int4, DataType.Unknown, DataType.Uuid]);
    }

    async all() {
        const sql = 'SELECT * from games;';
        // const res = this.execQuery(sql);
        const res = await this.execQuery(sql) || [];
        if(Array.isArray(res)) return res;

        const games: Game[] = [];

        for (const row of res.rows) {
            const id = row[0];
            const name = row[1];
            const description = row[2];

            games.push({ id, name, description } as Game);
        }

        return games;
    }

    async findGame(gid: string) {
        const sql = 'SELECT * from games where id=$1;';
        const res = await this.execQuery(sql, [gid]);

        const [row] = res.rows;
        const id = row[0];
        const name = row[1];
        const description = row[2];
        const game = { id, name, description } as Game;

        return game;
    }

    async findMissionsByGame(gid: string) {
        const sql = 'SELECT * from missions where game_id=$1;';
        const res = await this.execQuery(sql, [gid]);

        const missions: Mission[] = [];

        for (const row of res.rows) {
            const id = row[0];
            const name = row[1];
            const description = row[2];
            const points = row[3];
            const category = row[4];
            const game_id = row[5];

            missions.push({ id, name, description, points, category, game_id } as Mission);
        }

        return missions;
    }

    async findMissionByGame(gid: string, mid: string) {
        const sql = 'SELECT * from missions where game_id=$1 AND id=$2;';
        const res = await this.execQuery(sql, [gid, mid]);

        const [row] = res.rows;
        const id = row[0];
        const name = row[1];
        const description = row[2];
        const points = row[3];
        const category = row[4];
        const game_id = row[5];
        const mission = { id, name, description, points, category, game_id } as Mission;

        return mission;
    }
}