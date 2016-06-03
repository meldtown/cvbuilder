function ResumeLanguageModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	
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

	model.languageOptions = parent.dictionary.language;
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
			return model.languageOptions.findById(model.languageId());
		},
		write: function (newValue) {
			model.languageId(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(model.resource.requiredMessage));
	model.selectedLanguageOptionLabel = ko.computed(function () {
		return model.selectedLanguageOption() ? model.selectedLanguageOption().label() : '';
	});

	model.languageSkillOptions = parent.dictionary.languageSkill;
	model.selectedLanguageSkillOption = ko.computed({
		read: function () {
			return model.languageSkillOptions.findById(model.skillsLevel());
		},
		write: function (newValue) {
			model.skillsLevel(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(model.resource.requiredMessage));
	model.selectedLanguageSkillOptionLabel = ko.computed(function () {
		return model.selectedLanguageSkillOption() ? model.selectedLanguageSkillOption().label() : '';
	});

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
