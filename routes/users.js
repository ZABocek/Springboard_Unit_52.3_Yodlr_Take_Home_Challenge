var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();

var users = require('../init_data.json').data;
var curId = _.size(users) + 1;  // start IDs from size+1

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(_.toArray(users));
});

/* Create a new user */
router.post('/', function(req, res) {
  var user = req.body;
  user.id = curId++;
  if (!user.state) {
    user.state = 'pending';
  }
  users[user.id] = user;
  log.info('Created user', user);
  res.json(user);
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  res.json(user);
});

/* Delete a user by id */
router.delete('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  delete users[req.params.id];
  res.status(204).end();
  log.info('Deleted user', user);
});

/* Update a user by id */
router.put('/:id', function(req, res, next) {
  var user = req.body;
  if (parseInt(req.params.id, 10) !== user.id) {
    var err = new Error('ID parameter does not match body');
    err.status = 400;
    return next(err);
  }
  users[user.id] = user;
  log.info('Updating user', user);
  res.json(user);
});

module.exports = router;
