var mongoose = require('mongoose');
var Page     = mongoose.model('Page');
var _        = require('underscore');


exports.pages =  function(req, res) {
  var pageId = req.query.pageId
  console.log("Get list of items for page", pageId);
  Page.find({}, function(err, pages) {
    if (err) { res.json(400, err) }
    else {
        res.json(200, {pages:pages});
    } 
  });
};