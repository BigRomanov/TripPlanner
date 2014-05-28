var db      = require('../models');
var _       = require('underscore');

exports.list =  function(req, res){
  console.log("location.list", req.body);
  db.Location.findAll({where: {user_id :req.user.id}}).success(function(locations) {
    console.log("got locations", locations);
    res.json(200, {locations:locations});
  });
};

exports.create =  function(req, res){
  console.log("location.create", req.body);
 
  var url = decodeURIComponent(req.body.url);
  db.Location.findOrCreate({ user_id: req.user.id, url: url}).success(function(location, created) {
    if (created) {
      location.added = new Date().getTime();
    }
      
    location.title = req.body.title;
    location.faviconUrl = req.body.faviconUrl;
    location.marked = req.body.marked;

    location.save().success(function(newNote) {
      res.send(200);
    }).error(function(err) {
      res.json(400, {message:'Error while creating location'});
    });

  });
};

exports.get =  function(req, res){
  console.log("location.get", req.query, req.params);
  
  db.Location.find(req.params.id).success(function(location) {
    if (location.user_id == req.user.id) {
      res.json(200, {location:location});
    }
    else {
      res.json(400,{message: "Unauthorized"});
    }
  });
};

exports.update =  function(req, res){
  console.log("location.update", req.query, req.params, req.body);
  
  db.Location.find(req.params.id).success(function(location) {
    if (location.user_id == req.user.id) {
      location.updateAttributes(req.body, _.keys(req.body)).success(function() {
        res.json(200, {location:location});  
      });
    }
    else {
      res.json(400,{message: "Unauthorized"});
    }
  });
};

exports.remove =  function(req, res){
    db.Location.find(req.params.id).success(function(location) {
    if (location.user_id == req.user.id) {
      location.destroy().success(function() {
        res.json(200, {location:location});  
      });
    }
    else {
      res.json(400,{message: "Unauthorized"});
    }
  });
};
