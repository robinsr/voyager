/*!
 * Module dependencies.
 */

var async = require('async');
var config = require(__dirname + "/config");

/**
 * Controllers
 */

var users = require('../app/controllers/users'),
    expeditions = require('../app/controllers/expeditions'),
    auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

var expeditionAuth = [auth.requiresLogin, auth.expedition.hasAuthorization]
var commentAuth =    [auth.requiresLogin, auth.comment.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function(app, passport) {

    // user routes
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.post('/users/session',
        passport.authenticate('local'), users.session)
    app.get('/users/:userId', users.show)
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login'
        }), users.signin)
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/github',
        passport.authenticate('github', {
            failureRedirect: '/login'
        }), users.signin)
    app.get('/auth/github/callback',
        passport.authenticate('github', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/twitter',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }), users.signin)
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/google',
        passport.authenticate('google', {
            failureRedirect: '/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin)
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }), users.authCallback)
    app.get('/auth/linkedin',
        passport.authenticate('linkedin', {
            failureRedirect: '/login',
            scope: [
                'r_emailaddress'
            ]
        }), users.signin)
    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', {
            failureRedirect: '/login'
        }), users.authCallback)

    app.param('userId', users.user)

    // home route
    app.get('/', function (req,res){
        res.sendfile(config[process.env.NODE_ENV].root + "/voyager-desktop/app/index.html")
    });

    // expedition routes
    app.param('id', expeditions.load);
    app.get( '/api/expeditions',     expeditions.api.list);
    app.get( '/api/expeditions/:id', expeditions.api.get);
    app.post('/api/expeditions',     expeditions.api.create);
    app.put( '/api/expeditions/:id', expeditionAuth, expeditions.api.update);
    app.del( '/api/expeditions/:id', expeditionAuth, expeditions.api.destroy);


    // comment routes
    var comments = require('../app/controllers/comments')
    app.param('commentId', comments.load)
    app.post('/api/expeditions/:id/comments',            auth.requiresLogin, comments.create)
    app.get(' /api/expeditions/:id/comments',            auth.requiresLogin, comments.create)
    app.del(' /api/expeditions/:id/comments/:commentId', commentAuth, comments.destroy)

    // tag routes
    var tags = require('../app/controllers/tags')
    app.get('/api/tags/:tag', tags.index)

    // rating routes
    var ratings = require(__dirname + '/../app/controllers/ratings');
    app.post('/api/expeditions/:id/ratings', auth.requiresLogin, ratings.create)

    /**
     * Non-resource/utility routes
     */
    var geocode = require(__dirname + '/../app/controllers/geocode')
    app.get('/api/geocode', geocode.getLatLng);
}