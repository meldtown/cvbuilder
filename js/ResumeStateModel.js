function ResumeStateModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	model.resumeId = parent.resumeId;
	model.api = parent.api + '/resume/' + parent.resumeId + '/state';

	model.level = ko.observable();
	model.searchState = ko.observable();
	model.anonymous = ko.observable();
	model.branchIds = ko.observableArray();
	model.companyIds = ko.observableArray();

	model.levelOptions = [
		new DictionaryModel(model, {id: 1, ru: 'Активно ищу работу', ua: 'Активно шукаю роботу', en: 'Actively seeking employment'}),
		new DictionaryModel(model, {id: 2, ru: 'Работаю, но открыт для предложений', ua: 'Працюю, але розгляну пропозиції', en: 'Employed but open to new opportunities'})
	];

	model.get = function () {
		backend.get(model.api).success(function (data) {
			model.fromJS(data);

			model.searchState.subscribe(function (newValue) {
				model.save();
			});
		});
	};

	model.save = function () {
		backend.post(model.api, model.toJS());
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};
}
