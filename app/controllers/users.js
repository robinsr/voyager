/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Expedition = mongoose.model('Expedition'),
    utils = require('../../lib/utils'),
    async = require('async');

var login = function(req, res) {
    res.json({
        id: req.sessionID,
        user: {
            _id : req.user._id,
            name: req.user.name,
            username: req.user.username
        }
    });
}

exports.signin = function(req, res) {}

/**
 * Auth callback
 */

exports.authCallback = login

/**
 * Show login form
 */

exports.login = function(req, res) {
    res.render('users/login', {
        title: 'Login',
        message: req.flash('error')
    })
}

/**
 * Show sign up form
 */

exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    })
}

/**
 * Logout
 */

exports.logout = function(req, res) {
    req.logout()
    res.redirect('/login')
}

/**
 * Session
 */

exports.session = login

/**
 * Create user
 */

exports.create = function(req, res) {
    var user = new User(req.body)
    user.provider = 'local'
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                errors: utils.errors(err.errors),
                user: user,
                title: 'Sign up'
            })
        }

        // manually login the user once successfully signed up
        req.logIn(user, function(err) {
            if (err) return next(err)
            return res.redirect('/')
        })
    })
}

/**
 *  Show profile
 */

exports.show = function(req, res) {
    var user = req.profile
    res.render('users/show', {
        title: user.name,
        user: user
    })
}

/**
 * Find user by id
 */

exports.user = function(req, res, next, id) {
    async.series([

        function(cb) {
            User
                .findOne({
                    _id: id
                })
                .exec(function(err, user) {
                    if (!user) return cb(new Error('Failed to load User ' + id));
                    req.profile = user;
                    cb(err)
                })
        },
        function(cb) {
            var options = {
                criteria: {
                    user: id
                }
            };
            Expedition
                .list(options, function(err, expeditions) {
                    req.profile.expeditions = expeditions || [];
                    cb(err)
                })
        }
    ], function(err) {
        if (err) return next(err)
        next()
    })
}