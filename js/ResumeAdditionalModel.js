function ResumeAdditionalModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	model.resumeId = parent.resumeId;

	model.id = ko.observable();
	model.title = ko.observable().extend({required: true});
	model.description = ko.observable().extend({required: true});
	model.predifinedSections = ko.observableArray(['']);
	model.predefinedTitles = parent.dictionary.additional;

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
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
