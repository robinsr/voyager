
/**
 * Module dependencies.
 */

var express = 	require('express');
var http = 		require('http');
var path = 		require('path');
var routes = 	require(__dirname + '/routes');
var ex = 		require(__dirname + '/routes/expedition');
var user = 		require(__dirname + '/routes/user');
var score = 	require(__dirname + '/routes/score');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// index
app.get('/', routes.index);

// expeditions
app.get(	'/ex', 			ex.getAll);
app.post(	'/ex', 			ex.create);
app.get(	'/ex/:id',		ex.get);
app.put(	'/ex/:id', 		ex.update);

// users
app.post(	'/user', 		user.create);
app.get(	'/user/:id',	user.get);
app.put(	'/user/:id',	user.update);

// scores/reviews
app.post(	'/score',		score.create);
app.put(	'/score/:id'	score.update);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
