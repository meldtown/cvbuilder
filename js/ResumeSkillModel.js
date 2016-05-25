function ResumeSkillModel (parent) {
	var model = this;

	model.api = parent.api + '/resume/' + parent.resumeId + '/skill';

	model.resumeId = parent.resumeId;

	model.text = ko.observable();

	model.get = function () {
		backend.get(model.api).success(function (data) {
			model.fromJS(data);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(model.api, model.toJS())
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

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	InitEditableModel(model, 'skill');
	InitBadRequestResponseHandler(model);
}