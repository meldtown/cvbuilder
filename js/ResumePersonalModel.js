function ResumePersonalModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	
	model.api = parent.api + '/resume/' + parent.resumeId + '/personal';

	model.resumeId = parent.resumeId;

	model.name = ko.observable().extend({required: true});
	model.middleName = ko.observable();
	model.surName = ko.observable().extend({required: true});
	model.dateBirth = ko.observable().extend({required: true});
	model.sex = ko.observable().extend({required: true});
	model.cityId = ko.observable();
	model.moving = ko.observableArray();

	model.cityOptions = parent.dictionary.city;
	model.selectedCityOption = ko.computed({
		read: function () {
			return model.cityOptions.findById(model.cityId());
		},
		write: function (newValue) {
			model.cityId(newValue ? newValue.id : undefined);
		}
	}).extend({required: true});
	model.selectedCityOptionLabel = ko.computed(function () {
		return model.selectedCityOption() ? model.selectedCityOption().label() : '';
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
		model.moving(data.moving.map(function (item) {
			return new ResumePersonalMovingModel(model, item);
		}));
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

	model.edit = function () {
		model.beginEdit();
		model.moving().forEach(function (item) {
			item.beginEdit();
		});
	};

	model.cancel = function () {
		model.rollback();
		model.moving().forEach(function (item) {
			item.rollback();
		});
	};

	model.addMoving = function () {
		model.moving.push(new ResumePersonalMovingModel(model));
		model.edit();
	};

	InitEditableModel(model, 'personal');
	InitBadRequestResponseHandler(model);
}

function ResumePersonalMovingModel (parent, data) {
	var model = this;

	model.cityId = ko.observable(data);
	model.resource = parent.resource;

	model.toJS = function () {
		return model.cityId();
	};

	model.fromJS = function (data) {
		if (!data) return;

		model.cityId(data);
	};

	model.cityOptions = parent.cityOptions;
	model.selectedCityOption = ko.computed({
		read: function () {
			return model.cityOptions.findById(model.cityId());
		},
		write: function (newValue) {
			model.cityId(newValue ? newValue.id : undefined);
		}
	}).extend({required: true});
	model.selectedCityOptionLabel = ko.computed(function () {
		return model.selectedCityOption() ? model.selectedCityOption().label() : '';
	});

	model.remove = function (item) {
		parent.moving.remove(item);
		parent.save();
	};

	InitEditableModel(model, 'moving');
}
