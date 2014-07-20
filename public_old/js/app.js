/**
 * app.js
 *
 * This is the main starting point for the client-side application.
 * It acts a a simple router (works only for new expedition and edit
 * expedition at this point)
 */

require.config({
  paths: {
    "jquery": "/js/jquery.min",
    "ko": "/js/knockout.min",
    "bootstrap": "/js/boostrap.min"
  }
});

var pathname = window.location.pathname;
var pathArray = pathname.substring(1,pathname.length).split("/");

if (pathArray[0] == "expeditions" && pathArray[1] == "new"){
	require([
		'ko',
		'modules/viewmodels/expeditionViewmodel',
		'modules/models/expedition'],
		function(ko,vm,Expedition){
			var viewmodel = new vm();
			viewmodel.expedition(new Expedition({}))
			ko.applyBindings(viewmodel);
		})
} 

else if (pathArray[0] == "expeditions" && pathArray[1]) {
	require([
		'ko',
		'modules/viewmodels/expeditionViewmodel',
		'modules/models/expedition'],
		function(ko,vm,Expedition){
			var viewmodel = new vm();
			viewmodel.getJson(pathArray[1]);
			ko.applyBindings(viewmodel);
		})
}
