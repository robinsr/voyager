var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('util');

var placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: false
    },
    latitude: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    images: [{
        src: {
            type: String
        },
        title: {
            type: String
        }
    }],
    description: {
        type: String,
        required: false
    },
    /**
     * placeId
     * relates all like locations
     */
    placeId: {
        type: Schema.ObjectId,
        required: false
    },
    /**
     * interstitial
     * getting from one location to another. Interstitial precedes the location (how to get there)
     */
    interstitial: {
        travelMethod: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            reuqired: true
        } // mongo does not have decimal type
    },
    /**
     * order
     * numbrt order of location in the list of expedition's locations
     */
    order: {
        type: Number,
        required: true
    },
});

placeSchema.path("latitude").validate(function(value) {
    if (value) {
        return /^-?[0-9]+\.[0-9]+$/.test(value);
    } else {
        return true;
    }
}, "Invalid latitude");

placeSchema.path("longitude").validate(function(value) {
    if (value) {
        return /^-?[0-9]+\.[0-9]+$/.test(value);
    } else {
        return true;
    }
}, "Invalid longitude")

placeSchema.virtual('staticImage').get(function() {
    var baseGoogleMapString = "http://maps.google.com/maps/api/staticmap?center=%s&zoom=16&size=200x175&maptype=roadmap&sensor=false&language=&markers=color:red|label:none|%s";
    if (!this.address) {
        var coords = this.latitude + "," + this.longitude;
        return util.format(baseGoogleMapString, coords, coords);
    } else {
        return util.format(baseGoogleMapString, this.address, this.address)
    }
})

mongoose.model("Place", placeSchema);

module.exports = placeSchema;