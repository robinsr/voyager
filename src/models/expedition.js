var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expeditionSchema = new Schema({
	title: 			{type: String, required: true},
	description: 	{type: String, require: true},
	locations: 		[Location],
	images: 		[{
		src: { type: String },
		title: { type: String }
	}],
	popularity: 	String,
	score: 			Number,
	user: 			{type: Schema.ObjectId, ref: 'User'},
	createdAt: 		{type: Date, default: Date.now}
});

expeditionSchema.statics = {
	list: function (options, next) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(next)
  }
}

mongoose.model("Expedition",expeditionSchema);