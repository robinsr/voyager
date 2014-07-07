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
 * List
 */

exports.index = function(req, res) {
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    var perPage = 30
    var options = {
        perPage: perPage,
        page: page
    }

    Expedition.list(options, function(err, expeditions) {
        if (err) return res.render('500')
        Expedition.count().exec(function(err, count) {
            res.render('expeditions/index', {
                title: 'Expeditions',
                expeditions: expeditions,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            })
        })
    })
}

/**
 * New expedition
 */

exports.new = function(req, res) {
    res.render('expeditions/new', {
        title: 'New Expedition',
        expedition: new Expedition({})
    })
}

/**
 * Create an expedition - Ajax
 */

exports.create = function(req, res) {
    delete req.body._id;
    var expedition = new Expedition(req.body);
    expedition.user = req.user;
    expedition.save(function(err, ex) {
        var code = err ? 400 : 200;
        var response = err || ex.toObject();
        res.json(code, response);;
    });
}

/**
 * Edit an expedition
 */

exports.edit = function(req, res) {
    res.render('expeditions/edit', {
        title: 'Edit ' + req.expedition.title,
        expedition: req.expedition
    })
}

/**
 * Update expedition
 */

exports.update = function(req, res) {
    var expedition = req.expedition
    expedition = extend(expedition, req.body)

    expedition.save(function(err, ex) {
        var code = err ? 500 : 200;
        var response = err || ex.toObject();
        res.json(code, response);;
    });
}

/**
 * Show
 */

exports.show = function(req, res) {
    res.render('expeditions/show', {
        title: req.expedition.title,
        expedition: req.expedition
    })
}


/**
 * getJson
 * returns JSON for ajax calls
 */
exports.getJson = function(req, res) {
    if (req.expedition) {
        res.json(200, req.expedition.toObject());
    } else {
        res.send(404);
    }
}

/**
 * Delete an expedition
 */

exports.destroy = function(req, res) {
    var expedition = req.expedition
    expedition.remove(function(err) {
        req.flash('info', 'Deleted successfully')
        res.redirect('/expeditions')
    })
}