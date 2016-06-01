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

	model.predefinedTitles = parent.dictionary.additional;
	model.selectedPredefinedTitle = ko.observable();
	model.selectedPredefinedTitle.subscribe(function (label) {
		model.title(label === 'custom' ? '' : label);
		model.title.isModified(false);
	});


	model.fromJS = function (data) {
		mapper.fromJS(model, data);
		model.selectedPredefinedTitle(model.title());
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

	model.remove = function () {
		if (model.id()) {
			backend.remove(parent.api + '/resume/' + parent.resumeId + '/additional/' + model.id())
				.success(function () {
					parent.additional.remove(model);
				});
		} else {
			parent.additional.remove(model);
		}
	};

	InitEditableModel(model, 'additional');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
