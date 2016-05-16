/* global InitEditableModel */
function PersonalInfoModel (name, surName, dateBirth, sex) {
	var model = this;

	model.name = ko.observable(name).extend({required: true});
	model.surName = ko.observable(surName).extend({required: true});
	model.dateBirth = ko.observable(dateBirth).extend({required: true});
	model.sex = ko.observable(sex).extend({required: true});

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
