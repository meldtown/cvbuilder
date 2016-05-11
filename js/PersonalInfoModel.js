function PersonalInfoModel (firstName, lastName) {
	var model = this;

	model.firstName = ko.observable(firstName).extend({required: true});
	model.lastName = ko.observable(lastName).extend({required: true});

	model.save = function () {
		if(model.errors().length === 0) {
			if(model.firstName() === 'Alexandr') {
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
