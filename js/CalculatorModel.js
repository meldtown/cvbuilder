function CalculatorModel () {
	var model = this;

	model.a = ko.observable();
	model.b = ko.observable();

	model.sum = ko.computed(function () {
		return model.a() + model.b();
	});

	model.load = function () {
		jQuery.getJSON('/api/calc', function (data) {
			model.a(data.a);
			model.b(data.b);
		});
	};
}
