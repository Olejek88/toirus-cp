// file: test/api.js
var supertest = require('supertest');
const request = require('supertest');
const keystone = require('../../toirus');
const expect = require('chai').expect;
var agent     = supertest.agent(keystone);

describe('Login API', function() {
    it('Should success if credential is valid', function(done) {
        agent
           .post('http://localhost:3000//signin')
           .set('Accept', 'application/json')
           .set('Content-Type', 'application/json')
           .send({ username: 'username', password: 'password' })
           .expect(200)
           .expect('Content-Type', /json/)
           .expect(function(response) {
              expect(response.body).not.to.be.empty;
              expect(response.body).to.be.an('object');
           })
           .end(done);
    }); 
});