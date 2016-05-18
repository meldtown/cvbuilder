/* global InitEditableModel */
function PersonalInfoModel (parent, name, surName, dateBirth, sex) {
	var model = this;

	model.name = ko.observable(name).extend({required: true});
	model.surName = ko.observable(surName).extend({required: true});
	model.dateBirth = ko.observable(dateBirth).extend({required: true});
	model.sex = ko.observable(sex).extend({required: true});

	model.get = function () {
		$.ajax({
			method: 'GET',
			url: parent.api + '/api/contact/' + parent.resumeId,
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function (data) {
			console.log(data);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		});
	};

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

	InitEditableModel(model, 'personal-info');
}
