var mongoose = require('mongoose');
var Page     = mongoose.model('Page');
var _        = require('underscore');


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

  // Add url processing here...

  // Image url for testing
  var itemImage = "http://i2.cdn.turner.com/cnn/dam/assets/140520162630-origami-fashion1-entertain-feature.jpg";

  // For now we make the title equal to the url
  var itemTitle = itemUrl;

  if (pageId && itemUrl) {
    Page.findOne({_id: pageId}, function(err, page) {
      if (err) {
        console.log("Unable to create item, page not found");
        res.json(400, err)
      }
      else {
          var newItem = {title: itemTitle, url:itemUrl, images:[{url:itemImage}]};
          page.items.push(newItem);
          page.save(function(err, page) {
            if (err) {
              console.log("Unable to save page", err);
              res.json(400, err)
            }
            else {
              newItem.pageId = pageId;
              res.json(200, newItem)
            }
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

// TODO: Implement for item
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
