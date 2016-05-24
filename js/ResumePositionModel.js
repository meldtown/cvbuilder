function ResumePositionModel (parent, data) {
	var model = this;

	model.resumeId = parent.resumeId;

	model.position = ko.observable().extend({required: true});
	model.experienceId = ko.observable().extend({required: true});
	model.scheduleId = ko.observable().extend({required: true});
	model.salary = ko.observable();
	model.currencyId = ko.observable();

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		
	};

	InitEditableModel(model, 'training');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
