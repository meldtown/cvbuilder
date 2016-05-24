function ResumePositionModel (parent, data) {
	var model = this;

	model.resumeId = parent.resumeId;
	model.api = parent.api + '/resume/' + parent.resumeId + '/position';

	model.id = ko.observable();
	model.position = ko.observable().extend({required: true});
	model.experienceId = ko.observable().extend({required: true});
	model.scheduleId = ko.observable().extend({required: true});
	model.salary = ko.observable();
	model.currencyId = ko.observable();

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);
	};

	model.get = function () {
		backend.get(model.api).success(function (data) {
			model.fromJS(data);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/position', model.toJS())
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

	InitEditableModel(model, 'position');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
