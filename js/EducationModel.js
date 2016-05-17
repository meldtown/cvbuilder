function EducationModel (parent, id, typeOptions, selectedType, schoolName, location, speciality, diploma, year) {
	var model = this;

	model.id = ko.observable(id);
	model.typeOptions = typeOptions;
	model.selectedType = ko.observable(selectedType);
	model.schoolName = ko.observable(schoolName).extend({required: true});
	model.location = ko.observable(location).extend({required: true});
	model.speciality = ko.observable(speciality).extend({required: true});
	model.diploma = ko.observable(diploma).extend({required: true});
	model.year = ko.observableArray(year).extend({required: true});

	model.save = function () {
		if (model.errors().length === 0) {
			// $.post('/api/personal', {}).success(function () {
			// 	model.commit();
			// }).error(function (res) {
			// 	model.name.setError('Already taken');
			// 	model.errors.showAllMessages(true);
			// });
			// if (model.name() === 'Alexandr') {
			// 	// model.name.setError('Already taken');
			// 	// model.errors.showAllMessages(true);
			// } else {
			//
			// }
			model.commit();
		}
	};

	model.remove = function () {
		// ajax call will be here
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
	})

	InitEditableModel(model, 'education');
}
