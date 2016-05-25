function ResumePersonalModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});
	
	model.api = parent.api + '/resume/' + parent.resumeId + '/personal';

	model.resumeId = parent.resumeId;

	model.name = ko.observable().extend({required: true});
	model.middleName = ko.observable();
	model.surName = ko.observable().extend({required: true});
	model.dateBirth = ko.observable().extend({required: true});
	model.sex = ko.observable().extend({required: true});
	model.cityId = ko.observable();
	model.moving = ko.observableArray();

	model.cityName = ko.computed(function () {
		return 'TODO: CityName here from CityId';
	});
	model.age = ko.computed(function () {
		return 'TODO: from dateBirth';
	});

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);
		model.dateBirth(data.dateBirth);
		model.moving(data.moving);
	};

	model.get = function () {
		backend.get(model.api).success(function (data) {
			model.fromJS(data);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(model.api, model.toJS())
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

	InitEditableModel(model, 'personal');
	InitBadRequestResponseHandler(model);
}
