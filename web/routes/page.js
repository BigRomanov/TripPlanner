var mongoose = require('mongoose');
var Page     = mongoose.model('Page');
var _        = require('underscore');

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

exports.list =  function(req, res) {
  console.log("page.list", req.body);
  Page.find({}, function(err, pages) {
    if (err) {
      res.json(400, err)
    }
    else {
        res.json(200, {pages:pages});
    } 
  });
};

exports.create =  function(req, res) {

  var pageId = req.body.pageId;

  console.log(req.body);
  console.log(req.params);


  if (!pageId) {
    pageId = guid();
  }

  console.log("Creating new page with id: ", pageId);

  var newPage = new Page({_id: pageId});

  newPage.save(function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
      res.json(200, page)
    }
  });
};

exports.get =  function(req, res){
  console.log("page.get", req.query, req.params);
  
  Page.findOne({_id:req.params.id}, function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
      res.json(200, page)
    }
  });
};

exports.update =  function(req, res){
  console.log("page.update", req.query, req.params, req.body);

  Page.findOne({_id:req.params.id}, function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
      if (page) {
        // TODO: Copy all fields from the request body
        page.title = req.body.title;
        page.save(function(err, page) {
          res.json(200, page)

        })
      } else {
        // no page found
      }
    }
  });
};

exports.remove =  function(req, res){
  Page.remove({_id: req.params.id}, function(err, page) {
    if (err) { res.json(400, err); }
    else {
      res.json(200, page)
    }
  });
};
