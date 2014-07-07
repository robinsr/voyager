var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var Place = require(__dirname + "/place");

var expeditionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    places: [Place],
    tags: [String],
    images: [{
        src: {
            type: String
        },
        title: {
            type: String
        }
    }],
    popularity: String,
    score: Number,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        body: {
            type: String,
            default: ''
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});


/**
 * Methods
 */

expeditionSchema.methods = {

    /**
     * Add comment
     *
     * @param {User} user
     * @param {Object} comment
     * @param {Function} cb
     * @api private
     */

    addComment: function(user, comment, cb) {
        var notify = require('../mailer')

        this.comments.push({
            body: comment.body,
            user: user._id
        })

        if (!this.user.email) this.user.email = 'email@product.com'
        notify.comment({
            article: this,
            currentUser: user,
            comment: comment.body
        })

        this.save(cb)
    },

    /**
     * Remove comment
     *
     * @param {commentId} String
     * @param {Function} cb
     * @api private
     */

    removeComment: function(commentId, cb) {
        var index = utils.indexof(this.comments, {
            id: commentId
        })
        if (~index) this.comments.splice(index, 1)
        else return cb('not found')
        this.save(cb)
    }
}


/**
 * Statics
 */

expeditionSchema.statics = {

    /**
     * #load()
     * Find expedition by id
     */

    load: function(id, cb) {
        this.findOne({
            _id: id
        })
            .populate('user', 'name email username')
            .populate('places')
            .populate('comments.user')
            .exec(cb)
    },

    /**
     * #list()
     * List articles
     */

    list: function(options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria)
            .populate('user', 'name username')
            .sort({
                'createdAt': -1
            }) // sort by date
        .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }

}

mongoose.model("Expedition", expeditionSchema);