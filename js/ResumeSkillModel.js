function ResumeSkillModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;

	model.api = parent.api + '/resume/' + parent.resumeId + '/skill';

	model.resumeId = parent.resumeId;

	model.text = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));

	model.get = function () {
		backend.get(model.api).success(function (data) {
			model.fromJS(data);
			model.resumeId = parent.resumeId;
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(model.api, model.toJS())
				.success(function () {
					model.commit();
					model.successMessage(model.resource.successSave.label());
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		} else {
			model.errors.showAllMessages(true);
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
	InitResultMessage(model);
}
