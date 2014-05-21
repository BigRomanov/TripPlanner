var User = require('../models/user')
   ,redisC = require('redis')
   ,redis = redisC.createClient()
   ,uuid = require('node-uuid')
   ,store = require("memory-store")
   ,passwordHash = require('password-hash')
   ,PASSWORD_LENGTH = 6;

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
//password verification.
function validatePassword(password) {
  return (password != "" && password.toString().length >= PASSWORD_LENGTH);
}

exports.loginPage = function(req, res) {
  res.render('login');
};

exports.loginFrame = function(req, res) {
  res.render('login_frame');
};

exports.registerPage = function(req, res) {
  res.render('register');
};

exports.logout = function(req, res) {
  res.render('login', {
    user: null
  })
};

exports.resetPage = function(req, res) {
  res.render('reset');
};

exports.forgotPage = function(req, res) {
  res.render('forgot');
};

exports.resetMe = function(req, res) {
  var currentToken = req.param('tokenID');
  res.render('forgot', {
    tokenID: currentToken
  })
};

//Once User clicks on confirmation link from email to activate his account
exports.confirmMe = function(req, res) {
  var tokenID= req.param('tokenID');
  var callback = {
    expired: function() {
      res.end('The token is expired, try registration again please')
    },
    success: function() {

      User.findOne({ email: this.email }, function(err, user) {
          user.verified = true;
          user.save();
          res.render('index', {
            user: user
          })
      });
    }
  }

  var checkExpired = function(tokenID, callback) {
    var current_time = new Date();
    var request_time = null;
    db.Confirmation.find({
      where: {
        tokenID: tokenID
      }
    })
      .success(function(user) {
        request_time = user.dateAdded;
        current_time = current_time.getTime();
        var diff = (current_time - request_time) / 60000;
        console.log('the time diff is ' + diff);
        if (diff > 10) {
          //if more than 10 minutes, callback gets expired value
          callback.expired();
        } else {
          //otherwise, callback gets good to go with the user email and delete the user from confirm_register table
          callback.email = user.email;
          callback.success();

          user.destroy()
            .success(function(){
            })
        }
      })
  };
  checkExpired(tokenID, callback);
};

//Helper function for passport authentication configuration
exports.findByUsername = function(passport, email, password, done) {

  db.User.find({
    where: {
      email: email
    }
  })
    .success(function(user) {
      if (!user) {
        return done(null, false, {
          message: 'Unknown user ' + email
        });
      }
      if (!passwordHash.verify(password, user.password)) {
        return done(null, false, {
          message: 'Invalid password'
        })
      }
      passport.serializeUser(function(user, done) {
        done(null, user);
      });
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
      return done(null, user);
    })
  //TODO: add err handle function
}

// login using passport
exports.login = function(passport) {
  return function(req, res, next) {
    passport.authenticate('local',
      function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.render('login' ,{
            message: 'Oops. seems like the username or password is incorrect. Try again please.'
          });
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/');
        });
      })(req, res, next);
  }
};


exports.register = function(confirm) {
  return function(req, res) {
    var username = req.param('username');
    var email = req.param('email');
    var password = req.param('password');

    if (validateEmail(email)) {
      if (validatePassword(password)) {
        //check if email already exists. If it does, send message back to user
        db.User.find({where:{email:email}})
          .success(function(user) {
            if (user) {
              res.render('register', {
                message:'Hi there! seems like your email already exists. Try Logging in or using some other email address.'
              })
            }
            //if email does not already exist in user DB, create a new user with verified flag set to false
            else {
              var hashedPassword = passwordHash.generate(password);
              db.User.create({
                username: username,
                email: email,
                password: hashedPassword,
                verified: false
              })
                .success(function() {
                  //call the confirm module to insert the user into Confirm DB and send the mail
                  var callback = {
                    error: function(err) {
                      res.end('Error sending message: ' + err);
                    },
                    success: function(success) {
                      res.end('Check your inbox for a confirm message.');
                    }
                  };
                  confirm(email, callback);
                })
            }

          })

      } else {
        res.render('register', {
          message: "Invalid password. Please make sure your password contains at least " + PASSWORD_LENGTH + " characters"
        })
      }
    } else {
      res.render('register', {
        message: "Invalid email address. Please verify that the email address is correct"
      })
    }
  }
}



function generateCredentials(user_id) {
    // Generate user id and access_token
    var user_guid = uuid.v4();
    var access_token = uuid.v4();

    // Create mapping between the real user id and the generated one
    redis.set("user_id_" + user_id, user_guid);
    // Create mapping between generated user id and access token
    redis.set("user_guid_" + user_guid, JSON.stringify({
      access_token: access_token,
      user_id: user_id
    }));

    console.log("=========== NEW API CREDS ============");
    console.log("User id: ",  user_guid);
    console.log("Access token: ", access_token);

    return {
      user_guid : user_guid,
      access_token : access_token
    }
}

function loadCredentials(user_id) {
  var creds = null;
  redis.get(user_id, function(err, user_guid) {
    if (user_guid) {
      redis.get(user_guid, function(err, result) {
        var credentials = JSON.parse(result);
        if(credentials && credentials.user_id) {
          creds = {
                    user_guid : user_guid,
                    access_token : credentials.access_token
                  }
        }
      });
    }
  });

  return creds;
}

exports.api_tokens = function(req, res, next) {
  // Check if we have existing credentials
  var user_id = "user_id_" + req.user.id;
  var creds = loadCredentials(req.user.id);
  if (creds == null) {
    creds = generateCredentials(req.user.id);
  }

  return res.json(200, {
    user_guid : creds.user_guid,
    access_token : creds.access_token,
    username: req.user.username
  });
}

// API
exports.api_login = function(passport) {
  return function(req, res, next) {
    // TODO: Add mechanism for login throttling using redis based attempt count using ideas from
    // http://stackoverflow.com/questions/549/the-definitive-guide-to-form-based-website-authentication
    passport.authenticate('local',
      function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.json(401, {
            message: 'Unauthorized access'
          });
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }

          var creds = generateCredentials(user.id);

          return res.json(200, {
            user_guid : creds.user_guid,
            access_token : creds.access_token,
            username: user.username
          });
        });
      })(req, res, next);
  }
};


exports.forgot = function(forgot) {
  return function(req, res) {

    var email = req.body.email;

    var callback = {
      error: function(err) {
        res.end('Error sending message: ' + err);
      },
      success: function(success) {
        res.end('Check your inbox for a password reset message.');
      }
    };

    db.User.find({
      where: {
        email: email
      }
    })
      .success(function(user) {
        if (!user) {
          res.render('reset', {
            message: 'Please make sure the email address is correct.'
          })
        } else {
          forgot(email, callback);
        }

      })
  }
};

//password reset
exports.reset = function(forgot) {
  return function(req, res) {

    var tokenID = req.body.tokenID;
    var password = req.body.password;
    var confirm = req.body.confirm;
    var hashedPassword = passwordHash.generate(password);

    if (!validatePassword(password)) {
      res.render('reset', {
        message: "Invalid password. Please make sure your password contains at least 8 characters"
      });
    }
    if (password !== confirm) {
      res.render('reset', {
        message: 'passwords do not match, please try again'
      });
    }

    var callback = {
      expired: function() {
        res.render('reset', {
          message: 'Token has expired, please try again'
        });
      },
      success: function() {
        db.User.find({
          where: {
            email: this.email
          }
        })
          .success(function(user) {
            user.password = hashedPassword;
            user.save()
              .success(function() {
                //if successfully changed password, delete the tokenID
                res.render('index', {
                  user: user
                })
              })
          })
      }
    }
    var checkExpired = function(tokenID, callback) {
      var current_time = new Date(),
        request_time = null;
      db.PasswordResetRequest.find({
        where: {
          tokenID: tokenID
        }
      })
        .success(function(user) {
          request_time = user.dateAdded;
          current_time = current_time.getTime();
          var diff = (current_time - request_time) / 60000;
          console.log('the time diff is ' + diff);
          if (diff > 10) {
            //if more than 10 minutes, callback gets expired value
            callback.expired();
          } else {
            //otherwise, callback gets good to go with the user email
            callback.email = user.email;
            callback.success();

            user.destroy()
              .success(function(){
              })
          }
        })
    }
    checkExpired(tokenID, callback);
  };
}

