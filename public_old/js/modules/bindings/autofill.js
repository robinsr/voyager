define(['jquery','ko'],function($,ko){
	/**
	 * startsWith
	 * extend string prototype, returns boolean if string starts with the param
	 */
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function (str){
			return this.slice(0, str.length).toLowerCase() == str.toLowerCase();
		};
	}
	ko.bindingHandlers.autofill = {
		init: function(elem,val,vm,ab,bc){
			var input = val().input();
			var output = val().output;
			var elem = $(elem);
			elem.on("keyup",function(e){
				var text = e.target.value;
				var matches = ko.utils.arrayFilter(input,function(method){
					return method.startsWith(text);
				});
				output(matches.length == input.length ? [] : matches)
			})
		},
		update: function(elem,val,vm,ab,bc){
			var output = val().output;
			output([]);
			output.valueHasMutated();
		}
	}
})