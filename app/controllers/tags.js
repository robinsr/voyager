/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Expedition = mongoose.model('Expedition')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Expedition.list(options, function(err, expeditions) {
    if (err) return res.render('500')
    Expedition.count(criteria).exec(function (err, count) {
      res.render('expeditions/index', {
        title: 'Expeditions tagged ' + req.param('tag'),
        expeditions: expeditions,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}
