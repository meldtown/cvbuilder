/* global PersonalInfoModel */
/* global ContactsModel */
/* global ExperienceModel */
/* global EducationModel */
function CvBuilderModel (api, resumeId) {
	var model = this;

	model.api = api;
	model.resumeId = resumeId;

	model.personalInfo = new PersonalInfoModel(model);
	model.contacts = new ContactsModel(api, resumeId, 'marchenko.alexandr@gmail.com', '+3 8(091) 931-55-55');

	model.experience = ko.observableArray([]);

	model.getExperiences = function () {
		$.ajax({
			method: 'GET',
			url: parent.api + '/resume/' + parent.resumeId + '/experience',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function (data) {
			data.forEach(function (item) {
				model.experience.push(new ExperienceModel(model, item));
			});
		}).fail(function (jqXHR) {
			console.log(jqXHR);
		});
	};

	model.addExperience = function () {
		var item = new ExperienceModel(model);
		model.experience.push(item);
		item.beginEdit();
		return item;
	};

	model.education = ko.observableArray([
		new EducationModel(model, 2, ['high', 'secondary'], 'high', 'MIT', 'Boston', 'IT', 'bachelor', [2015, 2014, 2013, 2012, 2011]),
		new EducationModel(model, 3, ['high', 'secondary'], 'high', 'Oxford', 'London', 'Manager', 'magister', [2015, 2014, 2013, 2012, 2011])
	]);

	model.addEducation = function () {
		var item = new EducationModel(model, 5, ['high', 'secondary'], '', '', '', '', [2015, 2014, 2013, 2012, 2011]);
		model.education.push(item);
		item.beginEdit();
		return item;
	};
	model.educationBlockHasAdded = ko.observable(false);
	model.addEducationBlock = function () {
		model.educationBlockHasAdded(true);
	};
	model.removeEducationBlock = function () {
		model.educationBlockHasAdded(false);
	};

	model.getExperiences();
	model.personalInfo.get();
}
