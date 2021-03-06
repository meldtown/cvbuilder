function ResumeAdditionalModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});

	model.resumeId = parent.resumeId;

	model.id = ko.observable();
	model.title = ko.observable().extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));
	model.description = ko.observable().extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));

	model.selectedPredefinedTitle = ko.observable();
	model.selectedPredefinedTitle.subscribe(function (label) {
		model.title(label === parent.dictionary.additional[parent.dictionary.additional.length - 1].label() ? '' : label);
		model.title.isModified(false);
	});

	model.isCustomTitleSelected = ko.computed(function () {
		return model.selectedPredefinedTitle() === parent.dictionary.additional[parent.dictionary.additional.length - 1].label();
	});

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
		model.selectedPredefinedTitle(model.title());
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api() + '/resume/' + parent.resumeId + '/additional', model.toJS())
				.success(function (id) {
					model.id(id);
					model.commit();
					model.successMessage(parent.dictionary.resource.successSave.label());
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
			backend.remove(parent.api() + '/resume/' + parent.resumeId + '/additional/' + model.id())
				.success(function () {
					parent.additional.remove(model);
				});
		} else {
			parent.additional.remove(model);
		}
	};

	model.cancel = function () {
		model.rollback();
		parent.additional.remove(model);
	};

	model.isRemoveButtonVisible = ko.computed(function () {
		return model.id();
	});

	if (data) model.fromJS(data);

	InitEditableModel(model, 'additional');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);
}
