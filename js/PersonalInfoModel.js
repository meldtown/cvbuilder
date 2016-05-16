/* global InitEditableModel */
function PersonalInfoModel (name, surName, dateBirth, sex) {
	var model = this;

	model.name = ko.observable(name).extend({required: true});
	model.surName = ko.observable(surName).extend({required: true});
	model.dateBirth = ko.observable(dateBirth).extend({required: true});
	model.sex = ko.observable(sex).extend({required: true});

	model.save = function () {
		if (model.errors().length === 0) {
			if (model.firstName() === 'Alexandr') {
				model.firstName.setError('Already taken');
				model.errors.showAllMessages(true);
			} else {
				// ajax call will be here
				model.commit();
			}
		}
	};

	InitEditableModel(model, 'personal-info');
}
