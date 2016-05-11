function CvBuilderModel () {
	var model = this;

	model.cancel = function (item, array) {
		item.rollback();
		if (!item.id()) {
			array.remove(item);
		}
	};

	model.personalInfo = new PersonalInfoModel('Alexandr', 'Marchenko');
	model.contacts = new ContactsModel('marchenko.alexandr@gmail.com', '+3 8(091) 931-55-55');


	model.experience = ko.observableArray([
		new ExperienceModel(1, 'Google', 'Administrat'),
		new ExperienceModel(2, 'Oracle', 'DBA')
	]);

	model.addExperience = function () {
		var item = new ExperienceModel();
		model.experience.push(item);
		item.beginEdit();
		return item;
	};

	model.saveExperience = function (item) {
		if (item.errors().length === 0) {
			// ajax call will be here
			console.log('MAX', Math.max.apply(null, model.experience().map(function(item) {
				return isNaN(parseInt(item.id())) ? 0 : parseInt(item.id());
			})));
			item.id(1 + Math.max.apply(null, model.experience().map(function(item) {
					return isNaN(parseInt(item.id())) ? 0 : parseInt(item.id());
				})));
			item.commit();
		}
	};

	model.removeExperience = function (item) {
		// ajax call will be here
		model.experience.remove(item);
	};

	model.cancelExperience = function (item) {
		model.cancel(item, model.experience);
	};
}


