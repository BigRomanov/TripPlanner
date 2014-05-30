var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email:    String,
    password: String,
    dateAdded: { type: Date, default: Date.now },
    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }]
});
userSchema.methods.validPassword = function (password) {
  if (password === this.password) {
    return true; 
  } else {
    return false;
  }
}

mongoose.model('User', userSchema);


//
//var user = new User({ username: 'andrew', password: 'secret' });
//user.save();