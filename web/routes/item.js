var mongoose = require('mongoose');
var Page     = mongoose.model('Page');
var _        = require('underscore');
var extractor= require('../lib/extractor')


exports.list =  function(req, res) {
  var pageId = req.query.pageId
  console.log("Get list of items for page", pageId);
  Page.findOne({_id: pageId}, function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
        res.json(200, {items:page.items});
    } 
  });
};

exports.create =  function(req, res) {

  var pageId  = req.body.pageId;
  var itemUrl = req.body.url;

  if (pageId && itemUrl) {

    // Check we have the page before diving into resolving
    Page.findOne({_id: pageId}, function(err, page) {
      if (err) {
        console.log("Unable to create item, page not found");
        res.json(400, err)
      }
      else {
        // Use analyzer to create a new page
        var timeout = 2500;
        extractor.analyze(itemUrl, timeout, function(info) {
          console.log("urlInfo after waiting " + timeout + " ms:");
          console.log("%j", info);
        
          var title = ('titles' in info && _.keys(info.titles).length > 0) ? _.keys(info.titles)[0] : null
          var image = ('images' in info && _.keys(info.images).length > 0) ? _.keys(info.images)[0] : null

          var newItem = {title: title, url:itemUrl, images:[{url:image}]};

          console.log("New item: ", newItem);

          page.items.push(newItem);
          page.save(function(err, page) {
            if (err) {
              console.log("Unable to save page", err);
              res.json(400, err)
            }
            else {
              newItem._id = page.items[page.items.length - 1 ]._id;
              newItem.pageId = pageId;
              res.json(200, newItem)
            }
          });
        });
      }
    });
  }
  else
  {
    console.log("Unable to create item, no page id or item url in request");
    res.json(400);
  }
};


// TODO: Implement for item
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
  //console.log("page.update", req.query, req.params, req.body);

  Page.findOne({_id:req.body.pageId}, function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
      if (page) {

        page.updateItem(req.body);
    
        page.save(function(err, page) {
          res.json(200, page)
        });
        
      } else {
        // no page found
      }
    }
  });
};

exports.remove =  function(req, res){
  var itemId = req.params.id;
  var pageId = req.query.pageId;
  Page.findOne({_id:pageId}, function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
      for(var i = 0; i< page.items.length; i++) {
        if (page.items[i]._id == itemId) {
          page.items.splice(i,1);
          page.save(function(err, page) {
            if (err) {
              console.log("Unable to save page");
              res.json(400, err)
            }
            else {
              res.json(200); // consider returning deleted item
            }
          });
        }
      } 
      res.json(400);
    }
  });
};
