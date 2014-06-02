var mongoose = require('mongoose');

var Items = mongoose.Schema({
  title: String,
  url: String,
  images: [{url: String}],
  tags:[{name:String, slug: String}]
});

var Page = mongoose.Schema({
    _id:    String,
    _user: { type: Number, ref: 'User' },
    title : String,
    createdAt: Date,
    items:[Items]
});
mongoose.model('Page', Page);


