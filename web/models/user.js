module.exports = function() {
  var userSchema = mongoose.Schema({
      email:    String,
      password: String,
      dateAdded: { type: Date, default: Date.now },
      pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }]
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