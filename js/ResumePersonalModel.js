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
	model.cityId = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.moving = ko.observableArray();

	model.cityOptions = parent.dictionary.city;
	model.city = ko.computed(function () {
		var data = model.cityOptions.findById(model.cityId());
		return data ? data.label() : '';
	});
	model.cityId.subscribe(function (newValue) {
		model.moving.remove(function (item) {
			return item.cityId() === newValue;
		});
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

	// model.dateBirthFormatted = ko.computed(function () {
	// 	moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
	// 	return moment(model.dateBirth()).format('LL');
	// });
	model.age = ko.computed(function () {
		moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
		return moment.duration(moment() - moment(model.dateBirth())).humanize();
	});

	model.fullName = ko.computed(function () {
		return model.name() + ' ' + model.surName();
	});

	model.movingLabels = ko.computed(function () {
		return model.moving().map(function (item) {
			return item.label();
		}).join(', ');
	});

	model.removeEmptyMoving = function () {
		model.moving(model.moving().filter(function (item) {
			return item.cityId();
		}));
	};

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
			model.removeEmptyMoving();

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
	};

	model.cancel = function () {
		model.rollback();
	};

	model.addMoving = function () {
		model.moving.push(new ResumePersonalMovingModel(model));
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

	model.cityOptions = ko.computed(function () {
		var otherMovings = parent.moving().map(function (item) {
			return item.cityId();
		}).filter(function (cityId) {
			return cityId && cityId !== model.cityId();
		});

		return parent.cityOptions.filter(function (item) {
			return item.id !== parent.cityId() && otherMovings.indexOf(item.id) === -1;
		});
	});

	model.label = ko.computed(function () {
		var data = parent.cityOptions.findById(model.cityId());
		return data ? data.label() : '';
	});

	model.remove = function (item) {
		parent.moving.remove(item);
	};
}
