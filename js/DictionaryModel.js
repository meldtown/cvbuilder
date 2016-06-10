function DictionaryModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	ko.utils.extend(model, data);

	model.label = ko.computed(function () {
		if (model._lng().dictionary === 'en') return model.en || model.ru;
		else if (model._lng().dictionary === 'ua') return model.ua || model.ru;
		return model.ru;
	});
}
