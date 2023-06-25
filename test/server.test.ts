import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/server';

chai.use(chaiHttp);

describe('The root (/)', () => {
    it('returns a friendly message', () => {
        return chai.request(server)
            .get('/')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Hello world!');
            });
    });
});