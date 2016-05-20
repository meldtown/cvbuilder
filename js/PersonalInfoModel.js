/* global InitEditableModel */
function PersonalInfoModel (parent) {
	var model = this;

	model.name = ko.observable().extend({required: true});
	model.middleName = ko.observable();
	model.surName = ko.observable().extend({required: true});
	model.dateBirth = ko.observable().extend({required: true});
	model.sex = ko.observable().extend({required: true});
	// model.cityId = data.cityId;
	// model.cityName = ko.observable().extend({required: true});
	// model.moving = data.moving;
	// model.age = data.age;
	// model.resumeId = data.resumeId;

	model.get = function () {
		$.ajax({
			method: 'GET',
			url: parent.api + '/resume/' + parent.resumeId + '/personal',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function (data) {
			model.name(data.name);
			model.middleName(data.middleName);
			model.surName(data.surName);
			model.dateBirth(data.dateBirth);
			model.sex(data.sex);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		});
	};

	model.save = function () {
		// if (model.errors().length === 0) {
		$.ajax({
			type: 'POST',
			url: parent.api + '/resume/' + parent.resumeId + '/personal',
			data: JSON.stringify(
				{
					name: model.name(),
					middleName: '',
					surName: model.surName(),
					dateBirth: model.dateBirth(),
					sex: model.sex(),
					cityId: 1,
					moving: [],
					age: '23',
					cityName: 'Kiev',
					resumeId: parent.resumeId
				}
			),
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function (data) {
			console.log(data);
			model.commit();
		}).fail(function (jqXHR) {
			console.log(jqXHR);
			if (jqXHR.status === 400) {
				var errors = JSON.parse(jqXHR.responseText);

				if (errors.hasOwnProperty('modelState')) {
					if (errors.modelState['data.Name']) {
						model.name.setError(errors.modelState['data.Name']);
					}

					if (errors.modelState['data.SurName']) {
						model.surName.setError(errors.modelState['data.SurName']);
					}

					if (errors.modelState['data.middleName']) {
						model.surName.setError(errors.modelState['data.middleName']);
					}

					if (errors.modelState['data.dateBirth']) {
						model.surName.setError(errors.modelState['data.dateBirth']);
					}

					if (errors.modelState['data.sex']) {
						model.name.setError(errors.modelState['data.sex']);
					}

					model.errors.showAllMessages(true);
				}
			}
		});
		// }
	};

	InitEditableModel(model, 'personal-info');
}
