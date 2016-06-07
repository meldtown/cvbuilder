function ResumeTraininglModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;

	model.resumeId = parent.resumeId;
	model.id = ko.observable();
	model.name = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.location = ko.observable();
	model.description = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.year = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));

	model.yearOptions = [];
	for (var year = (new Date()).getFullYear(); year >= (new Date()).getFullYear() - 80; year--) {
		model.yearOptions.push(year);
	}

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/training', model.toJS())
				.success(function (id) {
					model.id(id);
					model.commit();
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

	model.remove = function () {
		backend.remove(parent.api + '/resume/' + parent.resumeId + '/training/' + model.id())
			.success(function () {
				parent.training.remove(model);
			});
	};

	model.cancel = function () {
		model.rollback();
		parent.training.remove(model);
	};

	InitEditableModel(model, 'training');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
