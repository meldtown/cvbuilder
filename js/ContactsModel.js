function ContactsModel (email, phone) {
	var model = this;

	model.email = ko.observable(email).extend({required: true, email: true});
	model.phone = ko.observable(phone).extend({required: true});

	model.save = function () {
		if(model.errors().length === 0) {
			// ajax call will be here
			model.commit();
		}
	};

	InitEditableModel(model, 'contacts');
}
