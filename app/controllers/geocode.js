var https = require('https');
var util = require('util');
var config = require(__dirname + '/../../config/config')


exports.latLng = function(address,next){

	var parseLatLng = function(strng){
		try {
			var data = JSON.parse(strng);
			var coords = {
				lat: data.results[0].geometry.location.lat,
				lng: data.results[0].geometry.location.lng,
			}
			next(null, coords)
		} catch (e){
			next(e)
		}
	}

	var basePath = '/maps/api/geocode/json?address=%s&key=%s';

	var path = util.format(basePath
		, encodeURIComponent(address)
		, config[process.env.NODE_ENV].geocode.key
	);

	var requestOptions = {
		hostname : 'maps.googleapis.com',
		path : path,
		port: 443,
		method: "GET",
		headers: {
			referer: "http://localhost"
		}
	}

	var req = https.request(requestOptions,  function(google) {
		if (google.statusCode == 200){
			var data = '';
			google.on('data',function(chunk){
				data += chunk.toString();
			})
			google.on('end',function(){
				return parseLatLng(data)
			})

		} else {
			next(new Error("Google returned status " + google.statusCode))
		}
	}).on('error', function(e) {
		next(e)
	});

	req.end();
}

exports.getLatLng = function(req,res){

	if (!req.query.address){
		res.send(400,"Missing parameter `address`")
	} else {
		exports.latLng(req.query.address,function(err,result){
			var statusCode = err ? 400 : 200;
			var data = err ? {message: err.toString} : result
			res.send(statusCode,data);
		})
	}

}