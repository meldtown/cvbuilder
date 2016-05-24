function ResumeContactsModel (parent) {
	var model = this;

	model.phone = ko.observable().extend({required: true});
	model.additionalPhones = ko.observableArray();
	model.email = ko.observable().extend({required: true, email: true});
	model.skype = ko.observable();
	model.portfolio = ko.observableArray();
	model.socialNetworks = ko.observableArray();

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);

		model.additionalPhones(data.additionalPhones.map(function (item) {
			return new ResumeContactsAdditionalPhoneModel(model, item);
		}));
		model.portfolio(data.portfolio);
		model.socialNetworks(data.socialNetworks);
	};

	model.get = function () {
		backend.get(parent.api + '/resume/' + parent.resumeId + '/contact').success(function (data) {
			model.fromJS(model, data);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/contact', model.toJS())
				.success(function () {
					model.commit();
					model.additionalPhones().forEach(function (item) {
						item.commit();
					});
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		}
	};

	model.edit = function () {
		model.beginEdit();
		model.additionalPhones().forEach(function (item) {
			item.beginEdit();
		});
	};

	model.cancel = function () {
		model.rollback();
		model.additionalPhones().forEach(function (item) {
			item.rollback();
		});
	};

	model.addAdditionalPhone = function () {
		model.additionalPhones.push(new ResumeContactsAdditionalPhoneModel(model));
		model.edit();
	};

	InitEditableModel(model, 'contacts');
	InitBadRequestResponseHandler(model);
}

function ResumeContactsAdditionalPhoneModel (parent, data) {
	var model = this;

	model.phone = ko.observable(data);

	model.toJS = function () {
		return model.phone();
	};

	model.fromJS = function (data) {
		if (!data) return;

		model.phone(data);
	};

	model.remove = function (item) {
		parent.additionalPhones.remove(item);
		parent.save();
	};

	InitEditableModel(model, 'phone');
}
