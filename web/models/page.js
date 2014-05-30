var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
    _id:    String,
    _user: { type: Number, ref: 'User' },
    title : String,
    createdAt: Date,
    items:[{
      title: String,
      url: String,
      images: [{url: String}]
    }]
});

console.log("Register page model");

mongoose.model('Page', pageSchema);


