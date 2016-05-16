/* global InitEditableModel */
function ContactsModel (api, resumeId, email, phone) {
	var model = this;

	model.email = ko.observable(email).extend({required: true, email: true});
	model.phone = ko.observable(phone).extend({required: true});

	model.additionalPhones = ko.observableArray();

	model.message = ko.observable();
	model.messageCls = ko.observable('text-success');

	model.get = function () {
		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: api + '/api/Contact/' + resumeId
		}).then(function (data) {
			console.log(data);
			model.additionalPhones(data.additionalPhones);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
			model.message(textStatus);
			model.messageCls('text-error');
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			$.post('/api/personal', {}).success(function () {
				model.commit();
			}).error(function () {
				model.firstName.setError('Already taken');
				model.errors.showAllMessages(true);
			});
			model.commit();
		}
	};

	InitEditableModel(model, 'contacts');
}
