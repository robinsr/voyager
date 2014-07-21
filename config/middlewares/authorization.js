/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.send(400, {
        error: "Requires login"
    })
}

/*
 *  User authorization routing middleware
 */

exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            res.send(400, {
                error: "You are not authorized"
            })
        }
        next()
    }
}

/*
 *  Expedition authorization routing middleware
 */

exports.expedition = {
    hasAuthorization: function(req, res, next) {
        if (req.expedition.user.id != req.user.id) {
            res.send(400, {
                error: "You are not authorized"
            })
        }
        next()
    }
}

/**
 * Comment authorization routing middleware
 */

exports.comment = {
    hasAuthorization: function(req, res, next) {
        // if the current user is comment owner or expedition owner
        // give them authority to delete
        if (req.user.id === req.comment.user.id || req.user.id === req.expedition.user.id) {
            next()
        } else {
            res.send(400, {
                error: "Only the commenter or the expedition owner can remove this comment"
            })
        }
    }
}