var mongoose = require('mongoose');
var Page     = mongoose.model('Page');
var User     = mongoose.model('User');
var _        = require('underscore');


exports.pages =  function(req, res) {
  Page.find({}, function(err, pages) {
    if (err) { res.json(400, err) }
    else {
        res.json(200, {pages:pages});
    } 
  });
};

exports.users =  function(req, res) {
  User.find({}, function(err, users) {
    if (err) { res.json(400, err) }
    else {
        res.json(200, {users:users});
    } 
  });
};

exports.deleteAllPages =  function(req, res) {
  Page.collection.remove(function(err, data) {
    if (err) { 
      res.json(400, err) 
    }
    else {
      res.json(200);
    }  
  });
};