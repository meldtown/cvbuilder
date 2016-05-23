/* global InitEditableModel */
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
		$.ajax({
			method: 'GET',
			url: parent.api + '/resume/' + parent.resumeId + '/contact',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function (data) {
			console.log(data);
			model.phone(data.phone);
			model.additionalPhones(data.additionalPhones);
			model.email(data.email);
			model.skype(data.skype);
			model.portfolio(data.portfolio);
			model.socialNetworks(data.socialNetworks);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		});
	};

	model.save = function () {
		// if (model.errors().length === 0) {
		$.ajax({
			type: 'POST',
			url: parent.api + '/resume/' + parent.resumeId + '/contact',
			data: JSON.stringify(
				{
					phone: model.phone(),
					additionalPhones: model.additionalPhones(),
					email: model.email(),
					skype: model.skype(),
					portfolio: model.portfolio(),
					socialNetworks: model.socialNetworks(),
					resumeId: model.resumeId
				}
			),
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function () {
			console.log(model.email());
			model.commit();
		}).fail(function (jqXHR) {
			console.log(jqXHR);
		});
		// }
	};
	// model.addNumber = function () {
	// 	return model;
	// };
	// function SocialNetworks(type, subtype, text) {
	// 	var model = this;
	// 	model.type = ko.observable(type);
	// 	model.subtype = ko.observable(subtype);
	// 	model.text = ko.observable(text);
	// }
	InitEditableModel(model, 'contacts');
}
