module.exports = function() {
  var pageSchema = mongoose.Schema({
      _id:    String,
      _user: { type: Number, ref: 'User' },
      title : String,
      createdAt: Date,
      items:[{
        title: String,
        url: String,
        images[{url: String}]
      }]
  });
  
  var Page = mongoose.model('Page', userSchema);

  return Page;

};
