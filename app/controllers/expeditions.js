/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Expedition = mongoose.model('Expedition');
var extend = require('extend');

/**
 * Load
 */

exports.load = function(req, res, next, id) {
    var User = mongoose.model('User')

    Expedition.load(id, function(err, expedition) {
        if (err) return next(err)
        if (!expedition) return next(new Error('not found'))
        req.expedition = expedition
        next()
    })
}


/**
 * =================
 * API Routes
 * =================
 */

exports.api = {};

exports.api.list = function(req, res) {
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    var perPage = 30
    var options = {
        perPage: perPage,
        page: page
    }

    Expedition.list(options, function(err, expeditions) {
        if (err) {
            return res.send(500)
        } else {
            return res.json(200, expeditions);
        }
    })
}
exports.api.get = function(req, res) {
    if (req.expedition) {
        res.json(200, req.expedition.toObject({ virtuals: true }));
    } else {
        res.send(404);
    }
}

exports.api.create = function(req, res) {
    delete req.body._id;
    delete req.body.user;
    var expedition = new Expedition(req.body);
    expedition.user = req.user;
    var statusCode = 200;
    var message = expedition;
    expedition.save(function(err, ex) {
        if (err){
            statusCode = 400;
            message = {
                error: err.toString()
            }
        }
        res.json(statusCode, message);;
    });
}

exports.api.update = function(req, res) {
    var expedition = req.expedition
    expedition = extend(expedition, req.body)
    var statusCode = 200;
    var message = {}
    expedition.save(function(err, ex) {
        if (err){
            statusCode = 400;
            message.error = err.toString()
        }
        res.json(statusCode, message);;
    });
}

exports.api.destroy = function(req,res){
    var expedition = req.expedition;
    var statusCode = 200;
    var message = {};
    expedition.remove(function(err) {
        if (err){
            statusCode = 400;
            message.error = err.toString()
        }
        res.json(statusCode, message)
    })
}
