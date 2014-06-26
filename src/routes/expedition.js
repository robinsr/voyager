/**
 * Module dependencies.
 */

var mongoose = 		require('mongoose');
var Expedition = 	mongoose.model('Expedition');

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Expedition.load(id, function (err, expedition) {
    if (err) return next(err)
    if (!expedition) return next(new Error('not found'))
    req.expedition = expedition
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  Expedition.list(options, function(err, expeditions) {
    if (err) return res.render('500')
    Expedition.count().exec(function (err, count) {
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

exports.new = function(req, res){
  res.render('expeditions/new', {
    title: 'New Expedition',
    expedition: new Expedition({})
  })
}

/**
 * Create an expedition
 */

exports.create = function (req, res) {
  var expedition = new Expedition(req.body)
  expedition.user = req.user

  expedition.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created expedition!')
      return res.redirect('/expeditions/'+expedition._id)
    }

    res.render('expeditions/new', {
      title: 'New Expedition',
      expedition: expedition,
      error: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an expedition
 */

exports.edit = function (req, res) {
  res.render('expeditions/edit', {
    title: 'Edit ' + req.expedition.title,
    expedition: req.expedition
  })
}

/**
 * Update expedition
 */

exports.update = function(req, res){
  var expedition = req.expedition
  expedition = extend(expedition, req.body)

  expedition.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/expeditions/' + expedition._id)
    }

    res.render('expeditions/edit', {
      title: 'Edit Expedition',
      expedition: expedition,
      error: utils.errors(err.errors || err)
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('expeditions/show', {
    title: req.expedition.title,
    expedition: req.expedition
  })
}

/**
 * Delete an expedition
 */

exports.destroy = function(req, res){
  var expedition = req.expedition
  expedition.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/expeditions')
  })
}