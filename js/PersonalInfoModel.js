/* global InitEditableModel */
/* global backend */
function ResumePersonalModel (parent) {
	var model = this;

	model.name = ko.observable().extend({required: true});
	model.middleName = ko.observable();
	model.surName = ko.observable().extend({required: true});
	model.dateBirth = ko.observable().extend({required: true});
	model.sex = ko.observable().extend({required: true});
	model.cityId = ko.observable();
	model.cityName = ko.observable().extend({required: true});
	model.moving = ko.observable();
	model.age = ko.observable();
	model.resumeId = parent.resumeId;

	model.get = function () {
		backend.get(parent.api + '/resume/' + parent.resumeId + '/personal')
			.success(model.simpleResponseHandler);
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/personal', model)
				.success(function () {
					model.commit();
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		}
	};

	InitEditableModel(model, 'personal-info');
	InitBadRequestResponseHandler(model);
	InitSimpleResponseHandler (model);
}
