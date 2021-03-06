function ResumeLanguageModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});

	model.resumeId = parent.resumeId;

	model.id = ko.observable();
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

	model.computedLanguageOptions = ko.computed(function () {
		var alreadySelectedLanguages = parent.language().map(function (item) {
			return item.languageId();
		});

		return parent.dictionary.language.filter(function (item) {
			return model.languageId() === item.id || alreadySelectedLanguages.indexOf(item.id) === -1;
		});
	});
	model.selectedLanguageOption = ko.computed({
		read: function () {
			return parent.dictionary.language.findById(model.languageId());
		},
		write: function (newValue) {
			model.languageId(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));
	model.selectedLanguageOptionLabel = ko.computed(function () {
		return model.selectedLanguageOption() ? model.selectedLanguageOption().label() : '';
	});

	model.selectedLanguageSkillOption = ko.computed({
		read: function () {
			return parent.dictionary.languageSkill.findById(model.skillsLevel());
		},
		write: function (newValue) {
			model.skillsLevel(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(parent.dictionary.resource.requiredMessage));
	model.selectedLanguageSkillOptionLabel = ko.computed(function () {
		return model.selectedLanguageSkillOption() ? model.selectedLanguageSkillOption().label() : '';
	});

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api() + '/resume/' + parent.resumeId + '/language', model.toJS())
				.success(function () {
					model._savedOrFromBackend(true);
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
		if (model._savedOrFromBackend()) {
			backend.remove(parent.api() + '/resume/' + parent.resumeId + '/language/' + model.languageId())
				.success(function () {
					parent.language.remove(model);
				});
		} else {
			parent.language.remove(model);
		}
	};

	model.cancel = function () {
		model.rollback();
		if (!model._savedOrFromBackend()) {
			parent.language.remove(model);
		}
	};

	if (data) {
		model.fromJS(data);
		model._savedOrFromBackend(true);
	}

	model.isRemoveButtonVisible = ko.computed(function () {
		return model._savedOrFromBackend();
	});

	InitEditableModel(model, 'language');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);
}
