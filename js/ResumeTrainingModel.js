function ResumeTraininglModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});
	model.resource = parent.dictionary.resource;
	model.cityOptions = parent.dictionary.city;
	model.resumeId = parent.resumeId;
	model.id = ko.observable();
	model.name = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.location = ko.observable();
	model.description = ko.observable();
	model.year = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.location = ko.observable();

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
			backend.post(parent.api() + '/resume/' + parent.resumeId + '/training', model.toJS())
				.success(function (id) {
					model.id(id);
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

	model.remove = function () {
		if (model.id()) {
			backend.remove(parent.api() + '/resume/' + parent.resumeId + '/training/' + model.id())
				.success(function () {
					parent.training.remove(model);
				});
		} else {
			parent.training.remove(model);
		}
	};

	model.cancel = function () {
		model.rollback();
		if (!model.id()) {
			parent.training.remove(model);
		}
	};

	InitEditableModel(model, 'training');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);

	if (data) model.fromJS(data);
}
