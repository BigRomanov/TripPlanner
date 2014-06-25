var mongoose = require('mongoose');
var Page     = mongoose.model('Page');
var User     = mongoose.model('User');
var _        = require('underscore');

// var guid = (function() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//                .toString(16)
//                .substring(1);
//   }
//   return function() {
//     return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//            s4() + '-' + s4() + s4() + s4();
//   };
// })();

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

  var newPage = new Page();

  newPage.save(function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
      res.cookie('pageId', page._id);
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
  Page.remove({_id: req.params.id}, function(err) {
    if (err) { res.json(400, err); }
    else {
      res.json(200)
    }
  });
};

function replacePage(user, page, callback) {
  if (!user || ! page) {
    callback("No user or page");
  }

  console.log("4444444", user, page);
  
  Page.remove({_id: page._id}, function(err) {
    if (err) { 
      callback(err); 
    }
    else {
      console.log("Old page id", page._id);
      var newPage = new Page();
      newPage.clone(page);
      newPage._user = user;
      newPage.save(function(err, page) {
        if (err) {
          callback(err);
        }
        else {
          console.log("New page id", newPage._id);
          user.pages.push(page);
          user.save(function(err, user) {
            if (err) {
              callback(err);
            } 
            else {
              user.notifyOnNewPage(page, callback);
            } 
          });
        }
      });
    }
  });
}

exports.save =  function(req, res){
  var pageId = req.body.pageId;
  var email = req.body.email;
  console.log("Saving page", pageId, email)
  Page.findOne({_id:pageId}, function(err, page) {
    if (err) {
      res.json(400, err)
    }
    else {
      if (page) {
        var theuser = null;
        // Lookup the user
        User.findOne({email:email}, function(err, user) {
          console.log("1111111", err, user);
          if (err) {
            console.log("Error while finding page", err);
          }
          else {
            if (user) {
              console.log("found user", err, user);
              replacePage(user, page, function(err) {
                if (err) {
                  console.log("Error when replacing page, err")
                  res.json(400);
                }
                else {
                  res.json(200);
                }
              });
            }
            else
            {
              console.log("2222222", err, user);
                // User not found, create one
              User.create({'email':email}, function(err, user) {
                console.log("3333333", err, user);
                if (err) {
                  console.log("Unable to create new user", err);
                }
                else
                {
                  replacePage(user, page, function(err) {
                    if (err) {
                      console.log("Error when replacing page, err")
                      res.json(400);
                    }
                    else {
                      res.json(200);
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });

  res.json(200);
};
