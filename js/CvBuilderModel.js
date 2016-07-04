function CvBuilderModel (api, resumeId, dictionary, data) {
	var model = this;

	model._maxResumeCount = 5;

	data = ko.utils.extend({
		resumeCount: 1,
		uiLanguage: 1,
		viewLink: '',
		rtfLink: '',
		state: undefined,
		position: undefined,
		personal: undefined,
		photo: undefined,
		contact: undefined,
		skill: undefined,
		experiences: [],
		educations: [],
		additionals: [],
		trainings: [],
		languages: []
	}, data);

	model.resumeId = resumeId;
	model._lngOptions = [
		{id: 1, label: 'Русский', moment: 'ru', dictionary: 'ru', enum: 'Russian'},
		{id: 3, label: 'Українська', moment: 'uk', dictionary: 'ua', enum: 'Ukrainian'},
		{id: 2, label: 'English', moment: 'us', dictionary: 'en', enum: 'English'}
	];
	var lng = model._lngOptions.filter(function (item) {
		return item.id === data.uiLanguage;
	}).shift();
	model._lng = ko.observable(lng || model._lngOptions[0]);
	model.selectedLanguageLabel = ko.computed(function () {
		return model._lng().label;
	});
	model._lng.subscribe(function () {
		backend.post(model.api() + '/resume/' + model.resumeId + '/uilanguage?language=' + model._lng().id);
	});

	model.api = ko.computed(function () {
		return api.replace('api.', model._lng().dictionary + '.api.');
	});

	model.veiwlink = ko.observable(data.viewLink);
	model.rtflink = ko.observable(data.rtfLink);
	model.resumeCount = ko.observable(data.resumeCount);
	model.isCopyLinkDisabled = ko.computed(function () {
		return model.resumeCount() > model._maxResumeCount;
	});

	model.isLanguageSelectPopupOpen = ko.observable(false);

	model.setEnglish = function () {
		model._lng(model._lngOptions[2]);
		model.isLanguageSelectPopupOpen(false);
	};
	model.setUkrainian = function () {
		model._lng(model._lngOptions[1]);
		model.isLanguageSelectPopupOpen(false);
	};
	model.setRussian = function () {
		model._lng(model._lngOptions[0]);
		model.isLanguageSelectPopupOpen(false);
	};
	model.isRussianSelected = ko.computed(function () {
		return model._lng().id === 1;
	});

	model.isUkrainianSelected = ko.computed(function () {
		return model._lng().id === 3;
	});

	model.isEnglishSelected = ko.computed(function () {
		return model._lng().id === 2;
	});

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
				if (id !== 0) id = id || '';
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

	model.percentExperienceFormatted = ko.computed(function () {
		return '+' + model.percentForBlock.experience + '%';
	});

	console.time('state');
	model.state = new ResumeStateModel(model, data.state);
	console.timeEnd('state');
	console.time('position');
	model.position = new ResumePositionModel(model, data.position, (data || {rubrics: null}).rubrics);
	console.timeEnd('position');
	console.time('personalInfo');
	model.personalInfo = new ResumePersonalModel(model, data.personal, (data || {photo: null}).photo);
	console.timeEnd('personalInfo');
	console.time('contacts');
	model.contacts = new ResumeContactsModel(model, data.contact);

	model.addAdditionalPhone = function () {
		model.contacts.additionalPhones.push('');
		model.contacts.beginEdit();
	};
	console.timeEnd('contacts');
	console.time('skill');
	model.skill = new ResumeSkillModel(model, data.skill);
	console.timeEnd('skill');

	console.time('experience');
	model.experience = ko.observableArray((data || {experience: []}).experiences.map(function (item) {
		return new ResumeExperienceModel(model, item);
	}));
	model.getExperiences = function () {
		backend.get(model.api() + '/resume/' + model.resumeId + '/experience').success(function (data) {
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
	console.timeEnd('experience');

	console.time('education');
	model.education = ko.observableArray(data.educations.map(function (item) {
		return new ResumeEducationModel(model, item);
	}));
	model.getEducation = function () {
		backend.get(model.api() + '/resume/' + model.resumeId + '/education').success(function (data) {
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
	console.timeEnd('education');

	console.time('language');
	model.language = ko.observableArray(data.languages.map(function (item) {
		return new ResumeLanguageModel(model, item);
	}));
	model.getLanguage = function () {
		backend.get(model.api() + '/resume/' + model.resumeId + '/language').success(function (data) {
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
	console.timeEnd('language');

	console.time('additional');
	model.additional = ko.observableArray(data.additionals.map(function (item) {
		return new ResumeAdditionalModel(model, item);
	}));
	model.getAdditional = function () {
		backend.get(model.api() + '/resume/' + model.resumeId + '/additional').success(function (data) {
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
	console.timeEnd('additional');

	console.time('training');
	model.training = ko.observableArray(data.trainings.map(function (item) {
		return new ResumeTraininglModel(model, item);
	}));
	model.addTraining = function () {
		var item = new ResumeTraininglModel(model);
		model.training.push(item);
		item.beginEdit();
		return item;
	};

	model.getTraining = function () {
		backend.get(model.api() + '/resume/' + model.resumeId + '/training').success(function (data) {
			data.forEach(function (item) {
				model.training.push(new ResumeTraininglModel(model, item));
			});
		});
	};
	console.timeEnd('training');

	console.time('date');
	model.date = ko.observable(data.updateDate);
	model.dateFormatted = ko.computed(function () {
		if (!model.date()) return '';

		moment.locale(model._lng().moment);
		return moment(model.date()).format('LL').replace('г.', '');
	});
	model.updateDate = function () {
		backend.post(model.api + '/resume/' + model.resumeId + '/date').success(function () {
			model.date(moment().format());
		});
	};
	console.timeEnd('date');

	console.time('searchState');
	model.searchState = ko.observable((data || {searchState: 1}).searchState || 1);
	model.searchState.subscribe(function () {
		backend.post(model.api() + '/resume/' + model.resumeId + '/searchstate?state=' + model.searchState());
	});
	model.searchStateOptions = [
		new DictionaryModel(model, {
			id: 1,
			ru: 'Активно <br /> ищу работу',
			ua: 'Активно <br /> шукаю роботу',
			en: 'Actively <br /> seeking employment'
		}),
		new DictionaryModel(model, {
			id: 2,
			ru: 'Работаю, но открыт <br /> для предложений',
			ua: 'Працюю, але розгляну <br /> пропозиції',
			en: 'Employed but open <br /> to new opportunities'
		})
	];

	model.selectedStateLabel = ko.computed(function () {
		return model.searchStateOptions.filter(function (item) {
			return item.id === model.searchState();
		}).shift().label();
	});

	model.isStateSelectPopupOpen = ko.observable(false);

	model.isSearchStateSelected = ko.computed(function () {
		return model.searchState() === 1;
	});

	model.isWorkStateSelected = ko.computed(function () {
		return model.searchState() === 2;
	});

	model.setSearch = function () {
		model.searchState(1);
		model.isStateSelectPopupOpen(false);
	};
	model.setWork = function () {
		model.searchState(2);
		model.isStateSelectPopupOpen(false);
	};
	console.timeEnd('searchState');

	console.time('rest');
	model.isExperienceBlockAdded = ko.computed(function () {
		return model.experience().length >= 2;
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
		var result = 35;
		var isThereDescription = model.experience()
			.some(function (item) {
				return item.description();
			});

		if (model.contacts.phone()) result += 10;
		if (model.skill.text()) result += 10;
		if (model.experience().length >= 1) result += 5;
		if (model.experience().length >= 2) result += 5;
		if (model.isEducationBlockAdded()) result += 10;
		if (model.isLanguageBlockAdded()) result += 5;
		if (model.isTrainingBlockAdded()) result += 5;
		if (model.position.salary()) result += 5;
		if (model.isAdditionalContactsAdded()) result += 5;
		if (model.personalInfo.isPhotoAdded()) result += 5;
		if (isThereDescription) result += 5;
		if (result > 100) return 100;

		return result;
	});

	model.congretPopupOpen = ko.observable(true);
	model.closeCongretPopup = function () {
		model.congretPopupOpen(false);
	};

	model.congretGrayNoExpPopupVisible = ko.computed(function () {
		return !model.experience().length && !model.education().length;
	});

	model.congretGrayPrivatePopupVisible = ko.computed(function () {
		return !model.congretGrayNoExpPopupVisible() && model.state.isVisibleOnlyToOwner();
	});

	model.congretGreenPopupVisible = ko.computed(function () {
		return model.congretPopupOpen() && !model.congretGrayNoExpPopupVisible() && !model.congretGrayPrivatePopupVisible();
	});

	model.isLevelOptionDisabled = ko.computed(function () {
		return !model.experience().length && !model.education().length && model.state.isVisibleOnlyToOwner();
	});

	model.more = ko.observable(false);

	model.toggleMore = function () {
		model.more(!model.more());
	};

	model.toggleMoreText = ko.computed(function () {
		return model.more() ? dictionary.resource.percentMoreHide.label() : dictionary.resource.percentMore.label();
	});
	model.percentIndicator = ko.computed(function () {
		return (1 - model.percent() / 100) * 150 - 6 + 'px';
	});

	model.isAllFooterBlocksAdded = ko.computed(function () {
		return model.isEducationBlockAdded() && model.isTrainingBlockAdded() && model.isAdditionalBlockAdded() && model.isLanguageBlockAdded() && model.isAdditionalContactsAdded();
	});

	model.isOneExperienceAdded = ko.computed(function () {
		return model.experience().length === 1;
	});

	model.addExperienceText = ko.computed(function () {
		if (model.isOneExperienceAdded()) {
			return model.dictionary.resource.addElseExperience.label();
		}
		return model.dictionary.resource.addExperience.label();
	});

	model.isAllActionsVisible = ko.observable(false);

	model.toggleAllActions = function () {
		model.isAllActionsVisible(!model.isAllActionsVisible());
	};

	model.toggleActionsText = ko.computed(function () {
		var item = model.isAllActionsVisible() ? model.dictionary.resource.turnActions : model.dictionary.resource.allActions;
		return item ? item.label() : '';
	});

	model.toggleActionsClass = ko.computed(function () {
		return model.isAllActionsVisible() ? 'fa fa-caret-up' : 'fa fa-caret-down';
	});

	model.isOnlyOneAdditionalAdded = ko.computed(function () {
		return model.additional().length === 1;
	});

	model.isOnlyOneEducationAdded = ko.computed(function () {
		return model.education().length === 1;
	});

	model.isOnlyOneExperienceAdded = ko.computed(function () {
		return model.experience().length === 1 && model.experience()[0].inTransaction() !== false;
	});

	model.isOnlyOneLanguageAdded = ko.computed(function () {
		return model.language().length === 1;
	});

	model.isOnlyOneTrainingAdded = ko.computed(function () {
		return model.training().length === 1;
	});

	model.createCopy = function () {
		backend.post(model.api() + '/resume/' + model.resumeId + '/copy')
			.success(function (data) {
				window.open(data);
			})
			.fail(function () {
			});
	};

	model.removeCV = function () {
		backend.remove(model.api() + '/resume/' + model.resumeId)
			.success(function () {
			})
			.fail(function () {
			});
	};

	model.print = function () {
		model.additional().forEach(function (item) {
			item.cancel();
		});
		model.contacts.cancel();
		model.education().forEach(function (item) {
			item.cancel();
		});
		model.experience().forEach(function (item) {
			item.cancel();
		});
		model.language().forEach(function (item) {
			item.cancel();
		});
		model.personalInfo.cancel();
		model.position.rollback();
		model.skill.rollback();
		model.training().forEach(function (item) {
			item.cancel();
		});
		window.print();
	};
	console.timeEnd('rest');
}
