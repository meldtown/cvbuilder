function CvBuilderModel (api, resumeId, dictionary) {
	var model = this;

	model.api = api;
	model.resumeId = resumeId;
	model._lngOptions = [
		{id: 1, label: 'Русский', moment: 'ru', dictionary: 'ru', enum: 'Russian'},
		{id: 3, label: 'Українська', moment: 'uk', dictionary: 'ua', enum: 'Ukrainian'},
		{id: 2, label: 'English', moment: 'us', dictionary: 'en', enum: 'English'}
	];
	model._lng = ko.observable(model._lngOptions[0]);

	model.dictionary = dictionary;

	// Map all resources into DictionaryModel
	Object.keys(model.dictionary).forEach(function (key) {
		// We have two kind of dictionaries
		// Array: [ {id:1, en: 'foo', ru: 'bar'}, ... ] - all except dictionary.resource
		// Object: { acme: {ru: 'foo', 'bar' } } - dictionary.resource is one of them
		if (Object.prototype.toString.call(model.dictionary[key]) === '[object Array]') {
			model.dictionary[key] = model.dictionary[key].map(function (item) {
				return new DictionaryModel(model, item);
			});

			// add findById method to dictionary
			model.dictionary[key].findById = function (id) {
				id = id || '';
				return model.dictionary[key].filter(function (item) {
					return item.id.toString() === id.toString();
				}).shift();
			};
		} else {
			Object.keys(model.dictionary[key]).forEach(function (innerKey) {
				model.dictionary[key][innerKey] = new DictionaryModel(model, model.dictionary[key][innerKey]);
			});
		}
	});

	model.percentForBlock = {
		phone: 10,
		experience: 5,
		education: 10,
		language: 5,
		photo: 5,
		training: 5,
		additionalContacts: 5
	};

	model.position = new ResumePositionModel(model);
	model.personalInfo = new ResumePersonalModel(model);
	model.contacts = new ResumeContactsModel(model);
	model.skill = new ResumeSkillModel(model);

	model.experience = ko.observableArray([]);

	model.getExperiences = function () {
		backend.get(parent.api + '/resume/' + model.resumeId + '/experience').success(function (data) {
			data.forEach(function (item) {
				model.experience.push(new ResumeExperienceModel(model, item));
			});
		});
	};

	model.addExperience = function () {
		var item = new ResumeExperienceModel(model);
		model.experience.push(item);
		item.beginEdit();
		return item;
	};

	model.education = ko.observableArray();

	model.getEducation = function () {
		backend.get(parent.api + '/resume/' + model.resumeId + '/education').success(function (data) {
			data.forEach(function (item) {
				model.education.push(new ResumeEducationModel(model, item));
			});
		});
	};

	model.addEducation = function () {
		var item = new ResumeEducationModel(model);
		model.education.push(item);
		item.beginEdit();
		return item;
	};
	model.addAdditionalPhone = function () {
		model.contacts.additionalPhones.push('');
		model.contacts.beginEdit();
	};

	model.language = ko.observableArray();

	model.getLanguage = function () {
		backend.get(parent.api + '/resume/' + model.resumeId + '/language').success(function (data) {
			data.forEach(function (item) {
				model.language.push(new ResumeLanguageModel(model, item));
			});
		});
	};

	model.addLanguage = function () {
		var item = new ResumeLanguageModel(model);
		model.language.push(item);
		item.beginEdit();
		return item;
	};

	model.additional = ko.observableArray();

	model.getAdditional = function () {
		backend.get(parent.api + '/resume/' + model.resumeId + '/additional').success(function (data) {
			data.forEach(function (item) {
				model.additional.push(new ResumeAdditionalModel(model, item));
			});
		});
	};

	model.addAdditional = function () {
		var item = new ResumeAdditionalModel(model);
		item.selectedPredefinedTitle(item.predefinedTitles[item.predefinedTitles.length - 1].label());
		model.additional.push(item);
		item.beginEdit();
		return item;
	};

	model.training = ko.observableArray([]);

	model.addTraining = function () {
		var item = new ResumeTraininglModel(model);
		model.training.push(item);
		item.beginEdit();
		return item;
	};

	model.getTraining = function () {
		backend.get(parent.api + '/resume/' + model.resumeId + '/training').success(function (data) {
			data.forEach(function (item) {
				model.training.push(new ResumeTraininglModel(model, item));
			});
		});
	};

	model.state = new ResumeStateModel(model);

	model.getUiLanguage = function () {
		backend.get(parent.api + '/resume/' + model.resumeId + '/uilanguage').success(function (data) {
			if (data) {
				var option = model._lngOptions.filter(function (item) {
					return item.id === data;
				}).shift();
				model._lng(option || model._lngOptions[0]);
			}

			model._lng.subscribe(function (newValue) {
				backend.post(parent.api + '/resume/' + model.resumeId + '/uilanguage?language=' + model._lng().id);
			});
		});
	};

	model.isExperienceBlockAdded = ko.computed(function () {
		return !!model.experience().length;
	});

	model.isEducationBlockAdded = ko.computed(function () {
		return !!model.education().length;
	});

	model.isLanguageBlockAdded = ko.computed(function () {
		return !!model.language().length;
	});

	model.isTrainingBlockAdded = ko.computed(function () {
		return !!model.training().length;
	});

	model.isAdditionalBlockAdded = ko.computed(function () {
		return !!model.additional().length;
	});

	model.isAdditionalContactsAdded = ko.computed(function () {
		return model.contacts.inTransaction() || (!!(model.contacts.additionalPhones().length || model.contacts.socialNetworks().length || model.contacts.isAddPortfolioButtonVisible() || model.contacts.skype()));
	});

	model.isPhoneAdded = ko.computed(function () {
		return model.contacts.inTransaction() || !!model.contacts.phone();
	});

	model.percent = ko.computed(function () {
		var result = 30;

		if (model.contacts.phone()) result += 10;
		if (model.skill.text()) result += 10;
		if (model.isExperienceBlockAdded()) result += 5;
		if (model.experience().length > 1) result += 5;
		if (model.isEducationBlockAdded()) result += 5;
		if (model.isLanguageBlockAdded()) result += 5;
		if (model.isTrainingBlockAdded()) result += 5;
		if (model.position.salary()) result += 5;
		if (model.isAdditionalContactsAdded()) result += 5;
		if (result > 100) return 100;
		// TODO: add photo;

		return result;
	});

	model.isCvCompleted = ko.computed(function () {
		return model.percent() === 100;
	});

	model.load = function () {
		model.getUiLanguage();
		model.state.get();
		model.personalInfo.get();
		model.contacts.get();
		model.skill.get();
		model.position.get();
		model.getExperiences();
		model.getEducation();
		model.getAdditional();
		model.getTraining();
		model.getLanguage();
	};

	model.load();
}
