/* global PersonalInfoModel */
/* global ContactsModel */
/* global ExperienceModel */
function CvBuilderModel () {
	var model = this;

	model.personalInfo = new PersonalInfoModel('Alexandr', 'Marchenko');
	model.contacts = new ContactsModel('marchenko.alexandr@gmail.com', '+3 8(091) 931-55-55');

	model.experience = ko.observableArray([
		new ExperienceModel(model, 1, 'Google', 'Administrat'),
		new ExperienceModel(model, 2, 'Oracle', 'DBA')
	]);

	model.addExperience = function () {
		var item = new ExperienceModel(model);
		model.experience.push(item);
		item.beginEdit();
		return item;
	};
}
