import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { join } from 'path';

import server from '../../../src/server';
import { BaseGame, Game } from '../../../src/models/game';
import { GameRepository } from '../../../src/repositories/game_repository';

chai.use(chaiHttp);

before(async () => {
    const gameRepo = new GameRepository();
    await gameRepo.tearDown();
});

describe('POST /api/v1/games', () => {
    beforeEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.setUp();
    });

    afterEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.tearDown();
    });

    const newGame: BaseGame = {
        name: '5th Grade Math Fun!',
        description: 'Let\'s have some fun by going on a hunt! Solve these math problems and earn points along the way!',
        missions: [],
    };

    it('Creates a new game and returns it', async () => {
        const res = await chai.request(server)
            .post('/api/v1/games')
            .set('Content-Type', 'application/json')
            .send(newGame);
        expect(res).to.have.status(201);
        expect(res).to.be.json;

        const game: Game = res.body.game;
        expect(game).to.eql({
            id: res.body.game.id,
            ...newGame,
        });
    });
});

describe('GET /api/v1/games', () => {
    beforeEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.setUp();
        await gameRepo.seed();
    });

    afterEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.tearDown();
    });

    it('Lists all games', async () => {
        const res = await chai.request(server).get('/api/v1/games');
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.games).to.eql([
            {
                id: "828131e4-39b2-4a26-81de-3b21343adbb1",
                name: "5th Grade Math Fun!",
                description: "Let's have some fun by going on a hunt! Solve these math problems and earn points along the way!",
            },
            {
                id: "1f5feb7a-060e-4a31-b06a-8f05244732d8",
                name: "Toronto landmark hunt",
                description: "This interactive quiz tour will take you to all the major landmarks and attractions the city has to offer!",
            }
        ]);
    });
});

describe('GET /api/v1/games/:gid', () => {
    beforeEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.setUp();
        await gameRepo.seed();
    });

    afterEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.tearDown();
    });

    const gid = '1f5feb7a-060e-4a31-b06a-8f05244732d8';

    it('Returns the game with the given ID', async () => {
        const res = await chai.request(server).get(`/api/v1/games/${gid}`);
        expect(res).to.have.status(200)
        expect(res).to.be.json;
        expect(res.body.game).to.eql({
            id: "1f5feb7a-060e-4a31-b06a-8f05244732d8",
            name: "Toronto landmark hunt",
            description: "This interactive quiz tour will take you to all the major landmarks and attractions the city has to offer!",
        });
    });
});

describe('GET /api/v1/games/:gid/missions', () => {
    beforeEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.setUp();
        await gameRepo.seed();
    });

    afterEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.tearDown();
    });

    const gid = '1f5feb7a-060e-4a31-b06a-8f05244732d8';

    it('Lists all missions associated with the given game', async () => {
        const res = await chai.request(server).get(`/api/v1/games/${gid}/missions`);
        expect(res).to.have.status(200)
        expect(res).to.be.json;
        expect(res.body.missions).to.eql([
            {
                id: '98faa7b1-0129-4e4f-85ba-ff087558c394',
                name: 'The tallest tower',
                description: 'This building stands above all others downtown and gives a view for miles on its observation deck. You\'ll need to get within 100m of this tower to complete this mission.',
                points: 200,
                category: 'gps',
                game_id: '1f5feb7a-060e-4a31-b06a-8f05244732d8'
            },
            {
                id: 'af631732-7700-4ee5-9718-eab2e034ee27',
                name: 'Trash Pandas',
                description: 'Raccoons are some of the city\'s feistiest residents! Snap a picture of an elusive trash panda to secure these points.',
                points: 1000,
                category: 'photo+video',
                game_id: '1f5feb7a-060e-4a31-b06a-8f05244732d8'
            }

        ]);
    });
});

describe('GET /api/v1/games/:gid/missions/:mid', () => {
    beforeEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.setUp();
        await gameRepo.seed();
    });

    afterEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.tearDown();
    });

    const gid = '1f5feb7a-060e-4a31-b06a-8f05244732d8';
    const mid = '98faa7b1-0129-4e4f-85ba-ff087558c394';

    it('Returns the mission with the given ID', async () => {
        const res = await chai.request(server).get(`/api/v1/games/${gid}/missions/${mid}`);
        expect(res).to.have.status(200)
        expect(res).to.be.json;
        expect(res.body.mission).to.eql({
            id: '98faa7b1-0129-4e4f-85ba-ff087558c394',
            name: 'The tallest tower',
            description: 'This building stands above all others downtown and gives a view for miles on its observation deck. You\'ll need to get within 100m of this tower to complete this mission.',
            points: 200,
            category: 'gps',
            game_id: '1f5feb7a-060e-4a31-b06a-8f05244732d8'
        });
    });
});

describe('POST /api/v1/games/:gid/missions', () => {
    beforeEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.setUp();
    });

    afterEach(async () => {
        const gameRepo = new GameRepository();
        await gameRepo.tearDown();
    });

    const gid = '1f5feb7a-060e-4a31-b06a-8f05244732d8';
    const newMission = {
        
        name: 'Trash Pandas',
        description: 'Raccoons are some of the city\'s feistiest residents! Snap a picture of an elusive trash panda to secure these points.',
        points: 1000,
        category: 'photo+video',
        game_id: gid,
    };

    it('Returns the mission with the given ID', async () => {
        const res = await chai.request(server)
            .post(`/api/v1/games/${gid}/missions`)
            .set('Content-Type', 'application/json')
            .send(newMission);
        expect(res).to.have.status(201)
        expect(res).to.be.json;
        expect(res.body.mission).to.eql({
            id: res.body.mission.id,
            ...newMission,
        });
    });
});