define([
	"ko",
	"modules/models/expedition",
	"modules/models/place",
	"modules/bindings/save",
	"modules/bindings/autofill"
	],function(ko,Expedition,Place){
	return function expeditionViewmodel(){
		var self = this;
		self.expedition = ko.observable();

		
		/**
		 * self.successMessage()
		 * displays a success message and hides it after 
		 * displayTime miliseconds
		 */
		self.successMessage = function(message,displayTime){

		}

		/**
		 * self.errorMessage()
		 * same as self.successMessage but show an error
		 * message
		 */
		self.errorMessage = function(message,displayTime){

		}

		self.getJson = function(id){
			$.get("/expeditions/" + id + "/json",function(data){
				var _places = [];
				for (var i = 0; i < data.places.length; i++) {
					_places.push(new Place(data.places[i]));
				};
				delete data.places;
				var _expedition = new Expedition(data);
				_expedition.isNew(false)
				_expedition.places(_places);
				self.expedition(_expedition);
			})
		}
	} 
})