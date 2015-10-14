'use strict';

var expect = require('chai').expect;
var User = require('../../models/user');
require('dotenv').load();

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/tdd-testing');

describe('User', function(){
  describe('saving', function(){
    beforeEach(function(done){
      User.remove({}, function(err){
        var user = new User({username: 'test1'});
        user.save(function(err, SavedUser){
        done();
        })
      });
    })
    it('saves new user', function(done){
      var user = new User({username: 'test'});
      user.save(function(err, SavedUser){
        expect(err).to.not.be.ok;
        expect(SavedUser.username).to.equal(user.username);
        done();
      })
    })
    it('does Not save a user - duplicate username', function(done){
      var user = new User({username: 'test1'});
      user.save(function(err, SavedUser){
        expect(err).to.be.ok;
        expect(SavedUser).to.not.be.ok;
        done();
      })
    })

  })
  var user;

  describe('.setPassword', function(){
    beforeEach(function(){
      user = new User({username: 'test'});
    });
    it('should set the password', function(done){
      user.setPassword('test');

      expect(user.salt).to.be.ok;
      expect(user.hash).to.be.ok;

      expect(user.salt).to.have.length(32);
      expect(user.hash).to.have.length(128);
      done();
    });
    it('should NOT set the password', function(done){
      // var user = new User({username: 'test'});
      user.setPassword('');

      expect(user.salt).to.not.be.ok;
      expect(user.hash).to.not.be.ok;
      done();
    });
  });
  describe('.validPassword', function(){
    beforeEach(function(){
      user = new User({username: 'test'});
      user.setPassword('test');
    })
    it('valid password', function(done){
      expect(user.validPassword('test')).to.be.true;
      done();
    });
    it('invalid password', function(done){
      // user.setPassword('test');
      expect(user.validPassword('fail')).to.be.false;
      done();
    });
  });
  describe('.generateJWT', function(){
    beforeEach(function(){
      user = new User({username: 'test'});
      user.setPassword('test');
    })
    it('should generate a JWT', function(done){
      var payload = JSON.parse(new Buffer(user.generateJWT().split('.')[1], 'base64').toString('ascii'));
      expect(payload.username).to.equal(user.username);
      expect(payload._id).to.equal(user._id.toString());
      done();
    });
  });
})
