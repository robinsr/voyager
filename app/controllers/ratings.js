exports.create = function(req, res) {
    var expedition = req.expedition
    var user = req.user

    if (!req.body.score) return res.redirect('/expeditions/' + expedition.id)

    expedition.addRating(user, req.body, function(err) {
        if (err) return res.render('500')
        res.redirect('/expeditions/' + expedition.id)
    })
}