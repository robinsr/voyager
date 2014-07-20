define(['jquery','ko'],function($,ko){
	ko.bindingHandlers.save = {
		init: function(elem,val,vm,ab,bc){
			$(elem).click(function(){
				$(elem).prop("disabled",true);
				var data = ko.unwrap(val());
				data.save(function(err){
					if (err) {
						bc.$root.errorMessage(data.errorMessage || "Save error", 1000);
					} else {
						bc.$root.successMessage(data.successMessage || "Save success", 1000);
					}
					$(elem).prop("disabled",false);
				})
			})
		}
	}
})