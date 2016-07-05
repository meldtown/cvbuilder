function ResumeEducationModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});

	model.resumeId = parent.resumeId;
	model.cityId = ko.observable();

	model.id = ko.observable();
	model.typeId = ko.observable();
	model.schoolName = ko.observable().extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));
	model.location = ko.observable().extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));
	model.speciality = ko.observable();
	model.diploma = ko.observable();
	model.year = ko.observable().extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));

	model.yearOptions = [];
	for (var year = (new Date()).getFullYear(); year >= (new Date()).getFullYear() - 80; year--) {
		model.yearOptions.push(year);
	}

	model.isSpecialityEnabled = ko.computed(function () {
		return model.typeId() !== 4;
	});

	model.schoolNameLabel = ko.computed(function () {
		return model.typeId() === 4
			? parent.dictionary.resource.educationSchoolNameLabel.label()
			: parent.dictionary.resource.educationUniversityNameLabel.label();
	});

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	model.typeOptions = parent.dictionary.educationType;
	model.selectedTypeOption = ko.computed({
		read: function () {
			return model.typeOptions.findById(model.typeId());
		},
		write: function (newValue) {
			model.typeId(newValue ? newValue.id : undefined);

			if (model.typeId() === 4) {
				model.speciality('');
			}
		}
	}).extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));
	model.selectedTypeOptionLabel = ko.computed(function () {
		return model.selectedTypeOption() ? model.selectedTypeOption().label() : '';
	});

	model.save = function () {
		parent.state.get();
		if (model.errors().length === 0) {
			backend.post(parent.api() + '/resume/' + parent.resumeId + '/education', model.toJS())
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
		parent.state.get();
		if (model.id()) {
			backend.remove(parent.api() + '/resume/' + parent.resumeId + '/education/' + model.id())
				.success(function () {
					parent.education.remove(model);
				});
		} else {
			parent.education.remove(model);
		}
	};

	model.cancel = function () {
		model.rollback();
		if (!model.id()) {
			parent.education.remove(model);
		}
	};

	model.isRemoveButtonVisible = ko.computed(function () {
		return model.id();
	});

	if (data) model.fromJS(data);

	InitEditableModel(model, 'education');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);
}
