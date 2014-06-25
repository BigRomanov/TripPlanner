var mongoose = require('mongoose');

var User = mongoose.Schema({
    email:    String,
    password: String,
    dateAdded: { type: Date, default: Date.now },
    pages: { type: [mongoose.Schema.Types.ObjectId], ref: 'Page' }
});

User.methods.validPassword = function (password) {
  if (password === this.password) {
    return true; 
  } else {
    return false;
  }
}

User.method({
  notifyOnNewPage : function(page, callback) {
    console.log("Send an email that new page was created with id", page._id);

    callback(null);
  }
});

mongoose.model('User', User);


//
//var user = new User({ username: 'andrew', password: 'secret' });
//user.save();