var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('util');
var geocode = require(__dirname + '/../controllers/geocode')

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


/**
 * Pre-save function
 * Adds lat/lng if there are none
 */
placeSchema.pre("save",function(next){
    var self = this;
    if (!self.latitude || !self.longitude){
        geocode.latLng(self.address,function(err,coordinates){
            if (err) return next(err);
            self.latitude = coordinates.lat;
            self.longitude = coordinates.lng;
            return next();
        })
    } else {
        return next();
    }
})

/**
 * 
 * Validations
 * 
 */

// validate latitude is a valid coordinate
placeSchema.path("latitude").validate(function(value) {
    if (value) {
        return /^-?[0-9]+\.[0-9]+$/.test(value);
    } else {
        return true;
    }
}, "Invalid latitude");

// validate that if there is no latitude, an address is provided
placeSchema.path("latitude").validate(function(value){
    if (!value && !this.address)
    return true;
}, "Address or latitude/longitude coordinates required");

// valideate that longitude is a valid coordinate
placeSchema.path("longitude").validate(function(value) {
    if (value) {
        return /^-?[0-9]+\.[0-9]+$/.test(value);
    } else {
        return true;
    }
}, "Invalid longitude");

// validate that is there is no longitude, an address is provided
placeSchema.path("longitude").validate(function(value){
    if (!value && !this.address)
    return true;
}, "Address or latitude/longitude coordinates required");



/**
 *
 * Virtuals
 * 
 */

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