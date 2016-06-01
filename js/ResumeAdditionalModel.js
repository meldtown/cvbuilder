function ResumeAdditionalModel(parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	model.resumeId = parent.resumeId;

	model.id = ko.observable();
	model.title = ko.observable().extend({required: true});
	model.description = ko.observable().extend({required: true});

	model.predefinedTitles = parent.dictionary.additional.map(function (data) {
		var item = new DictionaryModel(parent, mapper.toJS(data));
		item.isChecked = ko.observable();
		item.isChecked.subscribe(function (label) {
			model.title(label);

			console.table(model.predefinedTitles.map(function (z) {
				return {label: z.label(), ch: z.isChecked()};
			}));
		});
		item.inputName = ko.computed(function () {
			return 'additional-predefined-title-' + (model.id() || 0);
		});
		return item;
	});
	var zzz = new DictionaryModel(parent, {en: 'custom', ru: 'custom', ua: 'custom'});
	zzz.isChecked = ko.observable();
	zzz.isChecked.subscribe(function () {
		model.title('');
	});
	zzz.inputName = ko.computed(function () {
		return 'additional-predefined-title-' + (model.id() || 0);
	});

	model.predefinedTitles.push(zzz);


	model.fromJS = function (data) {
		mapper.fromJS(model, data);

		model.predefinedTitles.filter(function (item) {
			return item.label() === model.title();
		}).forEach(function (item) {
			item.isChecked(model.title());
		});
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/additional', model.toJS())
				.success(function (id) {
					model.id(id);
					model.commit();
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		}
	};

	function PredefinedTitle(data) {
		var model = this;
		model.title = ko.observable(data.label);
	}

	model.remove = function () {
		backend.remove(parent.api + '/resume/' + parent.resumeId + '/additional/' + model.id())
			.success(function () {
				parent.additional.remove(model);
			});
	};

	InitEditableModel(model, 'additional');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
