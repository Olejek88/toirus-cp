let should = require('chai').should();
let expect  = require('chai').expect;
let supertest  = require('supertest');
let chai = require('chai');
let request = require("request");
let assert = require("assert");

describe("smoke test", function() {

  describe("check login page", function() {
    var url = "http://localhost:3000";
    var urlme = "http://localhost:3000/me";
    it("returns status 200", function(done) {
      request(urlme, function(error, response, body) {
        if (response) {
    	    expect(response.statusCode).to.equal(200);
    	    done();
    	}
      });
    });

    it("have a login form", function(done) {
      request(urlme, function(error, response, body) {
	if (body) {
            try {
	        //assert(false, 'assertion error');
    		body.should.include("Email");
    	        done();
            }
	    catch (e) {
    	        done(e);
            }
        }
      });
    });        
  });

});
