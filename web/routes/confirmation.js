var Confirmation   = require('../models/confirmation'),
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

  var reset = new Confirm(opts);

  var self = function (email, cb) {

    reset.generateToken(48, function(tokenID) {

      reset.insertIntoConfirmRegisterDB(email, tokenID, function() {

        var uri = opts.uri + '?tokenID=' + tokenID;

        transport.sendMail({
          sender  : opts.from || 'confirmAccount@localhost',
          to      : email,
          subject : opts.subject || 'Confirm your account',
          text : opts.text || "",
          html :  opts.html || [
            'Click this link to confirm your account:\r\n',
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


function Confirm (opts) {
  this.sessions = opts.sessions || {};
  this.mount = url.parse(opts.uri);
  this.mount.port = this.mount.port || 80;
}

Confirm.prototype.generateToken = function(tokenSize, cb) {

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

Confirm.prototype.insertIntoConfirmRegisterDB = function(email, tokenID, cb) {

  var time = new Date();
  time = time.getTime();

  Confirmation.findOne({email:email}, function(err, confirmation) {
    if (confirmation) {     
      confirmation.dateAdded = time;
      confirmation.tokenID = tokenID;
      confirmation.save(function(err, confirmation) {
       if (confirmation) {
          cb()
        }
      })
    } else {
      //if email does not exist in reset DB we insert it with tokenID
      var cnf = new Confirmation({email: email, tokenID:tokenID, dateAdded: time}, function(err, confirmation) {
        console.log('the user inserted into confirm registration DB');
        cb();
      });
    }
  });
};
