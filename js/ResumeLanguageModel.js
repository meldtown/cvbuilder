function ResumeLanguageModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});
	
	model.resumeId = parent.resumeId;

	model.languageId = ko.observable(); // languageId here is treated as id and should be unique
	model.skillsLevel = ko.observable();
	model.certificate = ko.observable();
	model.isCanBeInterviewed = ko.observable();

	model._savedOrFromBackend = ko.observable(false);

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/language', model.toJS())
				.success(function () {
					model._savedOrFromBackend(true);
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
		backend.remove(parent.api + '/resume/' + parent.resumeId + '/language/' + model.languageId())
			.success(function () {
				parent.language.remove(model);
			});
	};

	model.cancel = function () {
		model.rollback();
		if (!model._savedOrFromBackend()) {
			parent.language.remove(model);
		}
	};

	InitEditableModel(model, 'language');
	InitBadRequestResponseHandler(model);

	if (data) {
		model.fromJS(data);
		model._savedOrFromBackend(true);
	}
}
