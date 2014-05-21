var PasswordResetRequest     = require('../models/password_reset_request'),
  url    = require('url'),
  mailer = require('nodemailer'),
  ent    = require('ent'),
  crypto = require('crypto');

module.exports = function (opts) {
  if (typeof opts === 'string') {
    opts = { uri : opts };
  }

  var transport;
  if (opts.transportType && opts.transportOptions) {
    transport = mailer.createTransport(opts.transportType, opts.transportOptions);
  } else {
    console.log("No transport type specified!");
  }

  var reset = new Forgot(opts);

  var self = function (email, cb) {

    reset.generateToken(48, function(tokenID) {

      reset.insertIntoResetDB(email, tokenID, function() {

        var uri = opts.uri + '?tokenID=' + tokenID;

        transport.sendMail({
          sender  : opts.from || 'nodepasswordreset@localhost',
          to      : email,
          subject : opts.subject || 'Password Reset Request',
          text : opts.text || "",
          html :  opts.html || [
            'Click this link to reset your password:\r\n',
            '<br>',
            '<a href="' + encodeURI(uri) + '">',
            ent.encode(uri),
            '</a>',
            ''
          ].join('\r\n')
        }, function (error, success) {
          if (error) {
            if (cb.error) cb.error(error);

          } else {
            if(cb.success) cb.success(success)
          }
        });
      });

    })

  };
  return self;
};


function Forgot (opts) {
  this.sessions = opts.sessions || {};
  this.mount = url.parse(opts.uri);
  this.mount.port = this.mount.port || 80;
}

Forgot.prototype.generateToken = function(tokenSize, cb) {

  crypto.randomBytes(tokenSize, function(ex, buf) {
    if (ex) {
      throw (ex);
    }
    else {
      var token = buf.toString('hex');
      cb(token);
    }
  });
};

Forgot.prototype.insertIntoResetDB = function(email, tokenID, cb) {

  PasswordResetRequest.findOne({email:email}, function(err, prr) {
    if (prr) {     
      prr.dateAdded = new Date();
      prr.tokenID = tokenID;
      prr.save(function(err, prr) {
       if (prr) {
          cb()
        }
      })
    } else {
      //if email does not exist in reset DB we insert it with tokenID
      var prr = new PasswordResetRequest({email: email, tokenID:tokenID, dateAdded: time}, function(err, prr) {
        console.log('Created new password reset request');
        cb();
      });
    }
  });
};
