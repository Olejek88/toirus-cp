process.env.NODE_ENV = process.env.NODE_ENV || 'test';
require('dotenv').load();

var keystone = require('keystone');
var chai = require('chai');

keystone.init({
  'name': 'toirus-cp',
  's3 config': {} //leave this here or stuff will break (magic)
});

keystone.import('../models');

chai.should();