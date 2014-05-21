module.exports = function() {
  var confirmationSchema = mongoose.Schema({
      id:    Number,
      email: String,
      tokenID: String,
      dateAdded: Date
  });
  
  var Confirmation = mongoose.model('Confirmation', confirmationSchema);

  return Confirmation;

};
