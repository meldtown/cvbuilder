/* global ResumePersonalModel */
/* global ResumeContactsModel */
/* global ResumeExperienceModel */
/* global ResumeEducationModel */
function CvBuilderModel (api, resumeId) {
	var model = this;

	model.api = api;
	model.resumeId = resumeId;

	model.personalInfo = new ResumePersonalModel(model);
	model.contacts = new ResumeContactsModel(model);

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
				model.experience.push(new ResumeExperienceModel(model, item));
			});
		}).fail(function (jqXHR) {
			console.log(jqXHR);
		});
	};

	model.addExperience = function () {
		var item = new ResumeExperienceModel(model);
		model.experience.push(item);
		item.beginEdit();
		return item;
	};

	model.education = ko.observableArray([
		new ResumeEducationModel(model, 2, ['high', 'secondary'], 'high', 'MIT', 'Boston', 'IT', 'bachelor', [2015, 2014, 2013, 2012, 2011]),
		new ResumeEducationModel(model, 3, ['high', 'secondary'], 'high', 'Oxford', 'London', 'Manager', 'magister', [2015, 2014, 2013, 2012, 2011])
	]);

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
	model.educationBlockHasAdded = ko.observable(false);
	model.addEducationBlock = function () {
		model.educationBlockHasAdded(true);
	};
	model.removeEducationBlock = function () {
		model.educationBlockHasAdded(false);
	};

	model.getExperiences();
	model.personalInfo.get();
	model.contacts.get();
}
