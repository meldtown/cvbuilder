function CvBuilderModel (api, resumeId) {
	var model = this;

	model.api = api;
	model.resumeId = resumeId;

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
		var item = new ResumeEducationModel(model, 5, ['high', 'secondary'], '', '', '', '', [2015, 2014, 2013, 2012, 2011]);
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
		model.getExperiences();
		model.getEducation();
		model.getAdditional();
		model.getTraining();
		model.getLanguage();
	};

	model.load();
}
