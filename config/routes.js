/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , expeditions = require('../app/controllers/expeditions')
  , auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.expedition.hasAuthorization]
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
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

  // article routes
  app.param('id',                   expeditions.load);
  app.get(  '/expeditions',         expeditions.index);
  app.get(  '/expeditions/new',     auth.requiresLogin, expeditions.new);
  app.post( '/expeditions',         auth.requiresLogin, expeditions.create);
  app.get(  '/expeditions/:id',     expeditions.show);
  app.get(  '/expeditions/:id/json',expeditions.getJson);
  app.get(  '/expeditions/:id/edit',articleAuth, expeditions.edit);
  app.put(  '/expeditions/:id',     articleAuth, expeditions.update);
  app.del(  '/expeditions/:id',     articleAuth, expeditions.destroy);

  // home route
  app.get('/', expeditions.index)

  // comment routes
  var comments = require('../app/controllers/comments')
  app.param('commentId', comments.load)
  app.post('/expeditions/:id/comments', auth.requiresLogin, comments.create)
  app.get('/expeditions/:id/comments', auth.requiresLogin, comments.create)
  app.del('/expeditions/:id/comments/:commentId', commentAuth, comments.destroy)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
