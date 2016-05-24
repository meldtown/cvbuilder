function ResumeAdditionalModel (parent, data) {
	var model = this;

	model.resumeId = parent.resumeId;

	model.id = ko.observable();
	model.title = ko.observable().extend({required: true});
	model.description = ko.observable().extend({required: true});

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.save = function () {};

	model.remove = function () {};

	InitEditableModel(model, 'additional');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
