var mongoose = require('mongoose');

var Items = mongoose.Schema({
  title: {type: String, default: "Set page title" },
  url: String,
  orientation: Number,
  sizeX: Number,
  order: Number,
  images: [{url: String}],
  tags:[{name:String, slug: String}]
});

var Page = mongoose.Schema({
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title : String,
    createdAt: Date,
    items:[Items]
});

Page.method({
  clone : function(page) {
    this.title      = page.title;
    this.createdAt  = page.createdAt;
    this.items      = page.items;
  },
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
        this.items[i].order = item.order;
        this.items[i].sizeX = item.sizeX;
      }
    };
  }
});

mongoose.model('Page', Page);


