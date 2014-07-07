define(["ko", "modules/util/transport", ], function(ko, transport) {
    function Place(opt) {
        var self = this;
        self.name = ko.observable(opt.name || null);
        self.longitude = ko.observable(opt.longitude || null);
        self.latitude = ko.observable(opt.latitude || null);
        self.address = ko.observable(opt.address || null);
        self.images = ko.observableArray(opt.images || []);
        self.description = ko.observable(opt.description || null);
        /**
         * placeId
         * relates all like locations
         */
        self.placeId = ko.observable();
        /**
         * interstitial
         * getting from one location to another. Interstitial precedes the location (how to get there)
         */
        self.interstitial = {
            travelMethod: ko.observable(opt.interstitial ? opt.interstitial.travelMethod : null),
            description: ko.observable(opt.interstitial ? opt.interstitial.description : null),
            cost: ko.observable(opt.interstitial ? opt.interstitial.cost : null)
        };
        /**
         * order
         * numbrt order of location in the list of expedition's locations
         */
        self.order = ko.observable(opt.order || null);

        /**
         * transportMethods, transportSuggestion, clickSuggestion
         * Handle the autocomplete function, suggesting different types of travel methods
         * for interetitial.travelMethod
         */
        self.transportMethods = ko.observableArray(transport.wordlist);
        self.transportSuggestion = ko.observableArray();
        self.clickSuggestion = function(data) {
            self.interstitial.travelMethod(data);
            self.transportSuggestion.removeAll();
        }
    };
    Place.prototype.toJSON = function() {
        console.log("copying")
        var copy = ko.toJS(this); //easy way to get a clean copy
        delete copy.transportMethods; //remove an extra property
        delete copy.transportSuggestion;
        return copy;
    };
    return Place;
})