/* global InitEditableModel */
/* global backend */
function ResumeContactsModel (parent) {
	var model = this;

	model.phone = ko.observable().extend({required: true});
	model.additionalPhones = ko.observableArray([]);
	model.email = ko.observable().extend({required: true, email: true});
	model.skype = ko.observable();
	model.portfolio = ko.observableArray([]);
	model.socialNetworks = ko.observableArray([]);
	model.resumeId = parent.resumeId;





	model.get = function () {
		backend.get(parent.api + '/resume/' + parent.resumeId + '/contact').success(function (data) {
			model.simpleResponseHandler(data, model);
			model.additionalPhones(data.additionalPhones);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/contact', model)
				.success(function () {
					model.commit();
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		}
	};

	InitEditableModel(model, 'contacts');
	InitBadRequestResponseHandler(model);
	InitSimpleResponseHandler (model);
}
