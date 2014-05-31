var express = require('express')
  , _       = require('underscore')
  , path    = require('path')
  , http    = require('http')
  , fs      = require('fs')

  //, redisC  = require('redis')
  //, redis   = redisC.createClient()
  , config = require('./config/config.json')
  , mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tripplanner');

// Bootstrap models
var models_path = __dirname + '/models'

console.log("Bootstrapping models from ", models_path)

fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) { 
      return done(err); 
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));

var forgot = require('./routes/password_reset_request')({
    uri: 'http://localhost:3000/password_reset',
    from: 'password-robot@localhost',
    transportType: 'SMTP',
    transportOptions: {
        service: "Gmail",
        auth: {
            user: config.credentials.email,
            pass: config.credentials.password
        }
    }
});

var confirm = require('./routes/confirmation')({
  uri: 'http://localhost:3000/confirm_register',
  from: 'password-robot@localhost',
  transportType: 'SMTP',
  transportOptions: {
    service: "Gmail",
    auth: {
      user: config.credentials.email,
      pass: config.credentials.password
    }
  }
});

//app
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());



// TODO:
// according to this: http://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
// the use of bodyParser is not recommended, as it is equivalent to use of json and urlencoded middleware, in addition 
// to an unsafe multipart - we should review and remove this before release
// also here: http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html
// app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());

app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// Configure routes // TODO: Move to a separate file?


var routes  = require('./routes/index')
  , user    = require('./routes/user') 
  , page    = require('./routes/page')
  , item    = require('./routes/item')

app.get('/', routes.index);

app.get('/pages',       page.list)
app.get('/page/:id',    page.get)
app.post('/page/new',   page.create)
app.put('/page/:id',    page.update)
app.delete('/page/:id', page.remove)

app.get('/items',       item.list)
app.get('/item/:id',    item.get)
app.post('/items',      item.create)
app.put('/item/:id',    item.update)
app.delete('/item/:id', item.remove)


// Served .jade angular partials
app.get('/angular/:name', function (req, res)
 { var name = req.params.name;
   res.render('angular/' + name);
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  //start server
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Bookies server listening on port ' + app.get('port'));
  });
});


// /////////////////////////////////////////////////////////////
// AUTH 

function webAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


