function ResumeSkillModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});

	model.resource = parent.dictionary.resource;

	model.resumeId = parent.resumeId;

	model.text = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));

	model.get = function () {
		backend.get(model.api() + '/resume/' + parent.resumeId + '/skill').success(function (data) {
			model.fromJS(data);
			model.resumeId = parent.resumeId;
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(model.api() + '/resume/' + parent.resumeId + '/skill', model.toJS())
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

	if (data) model.fromJS(data);

	InitEditableModel(model, 'skill');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);
}
