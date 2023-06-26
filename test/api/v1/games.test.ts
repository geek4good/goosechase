import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../../../src/server';
import { BaseGame, Game } from '../../../src/models/game';

chai.use(chaiHttp);

describe('POST /api/v1/games', () => {
    const newGame: BaseGame = {
        name: "5th Grade Math Fun!",
        description: "Let's have some fun by going on a hunt! Solve these math problems and earn points along the way!",
        missions: [],
    };

    it('Creates a new game and returns its JSON representation', async () => {
        return chai.request(server)
            .post('/api/v1/games')
            .set('Content-Type', 'application/json')
            .send(newGame)
            .then(res => {
                expect(res).to.have.status(201);
                expect(res).to.be.json;

                const game: Game = res.body.game;
                expect(game).to.eql({
                    id: res.body.game.id,
                    ...newGame,
                });
            });
    });
});