function ResumePositionModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model._keywordsApiUrl = ko.computed(function () {
		return parent.api + '/autocomplete/keyword';
	});

	model.resource = parent.dictionary.resource;

	model.resumeId = parent.resumeId;
	model.api = parent.api + '/resume/' + parent.resumeId + '/position';

	model.id = ko.observable();
	model.position = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.experienceId = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.scheduleId = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.salary = ko.observable().extend({
		digit: {
			params: true,
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		},
		min: {
			params: 1,
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		},
		max: {
			params: 200000,
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});
	model.currencyId = ko.observable();

	model.scheduleOptions = parent.dictionary.schedule;
	model.selectedScheduleOption = ko.computed({
		read: function () {
			return model.scheduleOptions.findById(model.scheduleId());
		},
		write: function (newValue) {
			model.scheduleId(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(model.resource.requiredMessage));
	model.selectedScheduleOptionLabel = ko.computed(function () {
		return model.selectedScheduleOption() ? model.selectedScheduleOption().label() : '';
	});

	model.currencyOptions = parent.dictionary.currency;
	model.selectedCurrencyOption = ko.computed({
		read: function () {
			return model.currencyOptions.findById(model.currencyId());
		},
		write: function (newValue) {
			model.currencyId(newValue ? newValue.id : undefined);
		}
	}).extend({
		validation: {
			validator: function (val) {
				if (!model.salary()) return true;

				return model.salary() && model.salary.isValid() && val;
			},
			message: function (params, observable) {
				return model.resource.requiredMessage.label();
			}
		}
	});
	model.selectedCurrencyOptionLabel = ko.computed(function () {
		return model.selectedCurrencyOption() ? model.selectedCurrencyOption().label() : '';
	});

	model.formattedSalary = ko.computed(function () {
		if (!model.salary()) return '';
		if (isNaN(parseInt(model.salary()))) return '';

		var result = parseInt(model.salary()).toLocaleString(model._lng() === 'en' ? 'us' : 'ru');

		if (model.currencyId() === 2) {
			result = '$' + result;
		} else {
			result = result + ' ' + model.selectedCurrencyOptionLabel();
		}

		return model.resource.from.label() + ' ' + result;
	});

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);
	};

	model.get = function () {
		backend.get(model.api).success(function (data) {
			model.fromJS(data);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/position', model.toJS())
				.success(function (id) {
					model.id(id);
					model.commit();
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		}
	};

	model.experienceOptions = parent.dictionary.experience;
	model.selectedExperienceOption = ko.computed({
		read: function () {
			return model.experienceOptions.findById(model.experienceId());
		},
		write: function (newValue) {
			model.experienceId(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(model.resource.requiredMessage));
	model.selectedExperienceOptionLabel = ko.computed(function () {
		return model.selectedExperienceOption() ? model.selectedExperienceOption().label() : '';
	});

	InitEditableModel(model, 'position');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
