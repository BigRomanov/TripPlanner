module.exports = function() {
  var userSchema = mongoose.Schema({
      email:    String,
      password: String
  });
  userSchema.methods.validPassword = function (password) {
    if (password === this.password) {
      return true; 
    } else {
      return false;
    }
  }
  var User = mongoose.model('User', userSchema);

  return User;

};

//
//var user = new User({ username: 'andrew', password: 'secret' });
//user.save();