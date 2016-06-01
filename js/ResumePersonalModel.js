function ResumePersonalModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	
	model.api = parent.api + '/resume/' + parent.resumeId + '/personal';

	model.resumeId = parent.resumeId;

	model.name = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.middleName = ko.observable();
	model.surName = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.dateBirth = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.sex = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
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
	}).extend(utils.requiredOnly(model.resource.requiredMessage));
	model.selectedCityOptionLabel = ko.computed(function () {
		return model.selectedCityOption() ? model.selectedCityOption().label() : '';
	});

	model.sexOptions = parent.dictionary.sex;
	model.selectedSexOption = ko.computed({
		read: function () {
			return model.sexOptions.findById(model.sex());
		},
		write: function (newValue) {
			model.sex(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(model.resource.requiredMessage));
	model.selectedSexOptionLabel = ko.computed(function () {
		return model.selectedSexOption() ? model.selectedSexOption().label() : '';
	});

	model.dateBirthFormatted = ko.computed(function () {
		moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
		return moment(model.dateBirth()).format('LL');
	});
	model.age = ko.computed(function () {
		moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
		return moment.duration(moment() - moment(model.dateBirth())).humanize();
	});

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);

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
					model.moving().forEach(function (item) {
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
	}).extend(utils.requiredOnly(model.resource.requiredMessage));
	model.selectedCityOptionLabel = ko.computed(function () {
		return model.selectedCityOption() ? model.selectedCityOption().label() : '';
	});

	model.remove = function (item) {
		parent.moving.remove(item);
		parent.save();
	};

	InitEditableModel(model, 'moving');
}
