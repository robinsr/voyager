var mongoose = 	require('mongoose');
var Article = 	mongoose.model('Article');


/**
 * [getAll description]
 * 
 */
exports.getAll = function(req,res){
	var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
	var perPage = 30
	var options = {
		perPage: perPage,
		page: page
	}

	Article.list(options, function(err, articles) {
		if (err) return res.render('500');
		Article.count().exec(function (err, count) {
			res.render('expeditions/index', {
				title: 'Expeditions',
				expeditions: expeditions,
				page: page + 1,
				pages: Math.ceil(count / perPage)
			});
		});
	});
};
/**
 * [getAll description]
 * 
 */
exports.create = function(req,res){

};
/**
 * [getAll description]
 * 
 */
exports.get = function(req,res){

};
/**
 * [getAll description]
 * 
 */
exports.update = function(req,res){

};