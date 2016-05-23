/* global InitEditableModel */
function ResumeEducationModel (parent, id, typeOptions, selectedType, schoolName, location, speciality, diploma, year) {
	var model = this;

	model.id = ko.observable(id);
	model.typeOptions = typeOptions;
	model.selectedType = ko.observable(selectedType);
	model.schoolName = ko.observable(schoolName).extend({required: true});
	model.location = ko.observable(location).extend({required: true});
	model.speciality = ko.observable(speciality).extend({required: true});
	model.diploma = ko.observable(diploma).extend({required: true});
	model.year = ko.observableArray(year);

	model.save = function () {
		if (model.errors().length === 0) {
			model.commit();
		}
	};

	model.remove = function () {
		parent.experience.remove(model);
	};

	model.cancel = function () {
		model.rollback();
		if (!model.id()) {
			model.remove();
		}
	};
	model.isSecondaryTypeSelected = ko.computed(function () {
		return model.selectedType() === 'secondary';
	});

	InitEditableModel(model, 'education');
}
