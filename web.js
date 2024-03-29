var express = require('express');
var port = process.env.PORT || 5000;
var app = module.exports = express();

// mysql

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: process.env.HOSTNAME,
	user: process.env.USERNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE
});
connection.connect();

process.on('SIGTERM', function () {
	console.log('CLosing app');
	//connection.end();
})

/*
var orm = require("orm");

app.use(orm.express("mysql:" + process.env.USERNAME + ":" + process.env.PASSWORD + "@" + process.env.HOSTNAME + "/" + process.env.DATABASE, {
    define: function (db, models) {
        models.article = db.define("article", {
            title: String,
            pub_date: Number,
            published: Boolean,
            body: String
        });
    }
}));
*/

// settings

// map .renderFile to ".html" files
//app.engine('html', require('ejs').renderFile);

// make ".html" the default
app.set('view engine', 'jade');

// set views for error and 404 pages
app.set('views', __dirname + '/views');

// define a custom res.message() method
// which stores messages in the session
app.response.message = function(msg){
  // reference `req.session` via the `this.req` reference
  var sess = this.req.session;
  // simply add the msg to an array for later
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};

// log
if (!module.parent) app.use(express.logger('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

// session support
app.use(express.cookieParser('some secret here'));
app.use(express.session());

// parse request bodies (req.body)
app.use(express.bodyParser());

// support _method (PUT in forms etc)
app.use(express.methodOverride());

// expose the "messages" local variable when views are rendered
app.use(function(req, res, next){
  var msgs = req.session.messages || [];

  // expose "messages" local variable
  res.locals.messages = msgs;

  // expose "hasMessages"
  res.locals.hasMessages = !! msgs.length;

  /* This is equivalent:
   res.locals({
     messages: msgs,
     hasMessages: !! msgs.length
   });
  */

  // empty or "flush" the messages so they
  // don't build up
  req.session.messages = [];
  next();
});

// load controllers
require('./lib/boot')(app, { verbose: !module.parent });

// assume "not found" in the error msgs
// is a 404. this is somewhat silly, but
// valid, you can do whatever you like, set
// properties, use instanceof etc.
app.use(function(err, req, res, next){
  // treat as 404
  if (~err.message.indexOf('not found')) return next();

  // log it
  console.error(err.stack);

  // error page
  res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).render('404', { url: req.originalUrl });
});

if (!module.parent) {
  app.listen(port);
  console.log('\n  listening on port ' + port + '\n');
}