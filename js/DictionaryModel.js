function DictionaryModel (parent, data) {
	var model = this;

	ko.utils.extend(model, data);

	model._lng = ko.computed(parent._lng());
	parent._lng.subscribe(function (newValue) {
		model._lng(newValue);
	});

	model.label = ko.computed(function () {
		if(model._lng() === 'en') return model.en || model.ru;
		else if(model._lng() === 'ua') return model.ua || model.ru;
		return model.ru;
	});
}
