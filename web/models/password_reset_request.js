module.exports = function() {
  var passwordResetRequestSchema = mongoose.Schema({
      id:    Number,
      email: String,
      tokenID: String,
      dateAdded: Date
  });
  
  var PasswordResetRequest = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);

  return PasswordResetRequest
};

