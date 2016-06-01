function CvBuilderModel (api, resumeId, dictionary) {
	var model = this;

	model.api = api;
	model.resumeId = resumeId;
	model._lng = ko.observable('ru');
	model._lngOptions = ['ru', 'ua', 'en'];

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
		item.predefinedTitles.filter(function (item) {
			return item.label() === 'custom';
		}).forEach(function (item) {
			console.log('I am going to check', item);
			item.isChecked(true);
		});
		console.table(item.predefinedTitles.map(function (z) {
			return {label: z.label(), ch: z.isChecked()};
		}));

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

	model.load = function () {
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
