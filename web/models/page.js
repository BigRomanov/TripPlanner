var mongoose = require('mongoose');

var Items = mongoose.Schema({
  title: String,
  url: String,
  orientation: Number,
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

Page.method({
  getItem : function(itemId, callback) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i]._id == itemId)
        callback(item);
    };

    callback(null);
  },
  updateItem : function(item) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i]._id == item._id) {
        this.items[i].title = item.title;
        this.items[i].url = item.url;
        this.items[i].images = item.images;
        this.items[i].tags = item.tags;
        this.items[i].orientation = item.orientation;
      }
    };
  }
});

mongoose.model('Page', Page);


