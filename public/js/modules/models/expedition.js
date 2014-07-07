define(["ko", "modules/models/place"], function(ko, Place) {
    return function Expedition(opt) {
        var self = this;

        /**
         * Expedition Properties
         */
        self._id = opt._id || null;
        self.isNew = ko.observable(opt.isNew || true);
        self.title = ko.observable();
        self.description = ko.observable();
        self.places = ko.observableArray();
        self.tags = ko.observableArray([]);
        self.images = ko.observableArray([]);
        self.popularity = ko.observable();
        self.score = ko.observable();
        self.user = ko.observable();
        self.createdAt = ko.observable();

        for (var n in opt) {
            if (self[n] && ko.isObservable(self[n])) {
                self[n](opt[n]);
            } else if (self[n]) {
                self[n] = opt[n];
            }
        }

        console.log(ko.toJS(self))


        /**
         * Expedition Methods
         */

        /**
         * self.save()
         * saves the expedition to the server. On success switches self.isNew to false.
         * Uses callback next(err);
         */
        self.save = function(next) {
            var method = self.isNew() ? 'post' : 'put';
            var url = self.isNew() ? '/expeditions/' : '/expeditions/' + self._id;
            $.ajax(url, {
                type: method,
                data: ko.toJSON(self),
                processData: false,
                contentType: "application/json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', $("#csrf").val());
                },
                statusCode: {
                    404: function() {
                        next("404");
                    },
                    500: function() {
                        next("500");
                    },
                    200: function(data) {
                        self._id = data._id;
                        self.isNew(false);
                        next(null);
                    }
                }
            })
        };

        self.addLocation = function() {
            var order = self.places.length;
            self.places.push(new Place({
                order: order + 1
            }));
        };

        /**
         * self.getTags()
         * returns self.tags as a string. When writing to getTags, it
         * splits the value on ","
         */
        self.getTags = ko.computed({
            read: function() {
                return self.tags().join(",");
            },
            write: function(val) {
                self.tags = val.split(",");
            }
        });
    }
})