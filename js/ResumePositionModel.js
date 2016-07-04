function ResumePositionModel (parent, data, rubrics) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});

	model._keywordsApiUrl = ko.computed(function () {
		return parent.api() + '/autocomplete/keyword';
	});

	model.resource = parent.dictionary.resource;
	model.rubricOptions = parent.dictionary.rubric;
	model.selectedRubric = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));

	model.subRubricsFilteredByParentRubric = ko.computed(function () {
		if (!model.selectedRubric()) return [];

		var selectedRubricId = model.selectedRubric().id;

		return parent.dictionary.subrubric.filter(function (item) {
			return item.parentId === selectedRubricId;
		});
	});

	model.experienceOptions = parent.dictionary.experience;
	model.checkedSubRubrics = ko.observableArray([]);
	model.checkedSubRubrics.subscribe(function (newValue) {
		newValue.forEach(function (item) {
			if (!item.hasOwnProperty('selectedExperienceOption')) {
				item.selectedExperienceOption = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
			}/* else {
				item.selectedExperienceOption(undefined);
				item.selectedExperienceOption.clearError();
			}*/
		});
	});
	model.isCheckboxEnabled = function (data) {
		var selectedIds = model.checkedSubRubrics().map(function (i) { return i.id; });
		return model.checkedSubRubrics().length < 2 || selectedIds.indexOf(data.id) !== -1;
	};
	model.unCheckSubRubric = function (item) {
		model.checkedSubRubrics.remove(item);
	};

	model.resumeId = parent.resumeId;
	model.id = ko.observable();
	model.position = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.scheduleId = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));

	model.salary = ko.observable().extend({
		digit: {
			params: true,
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		},
		min: {
			params: 0,
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
		var data = mapper.toJS(model);
		data.salary = data.salary || 0;
		delete data.rubric;
		delete data.subrubric;
		return data;
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);
	};

	model.rubricsFromJS = function (data) {
		if (!data) return;

		var checkedSubRubrics = data.map(function (item) {
			var subrubric = parent.dictionary.subrubric.findById(item.id);
			var option = model.experienceOptions.findById(item.experienceId);
			subrubric.selectedExperienceOption = ko.observable(option).extend(utils.requiredOnly(model.resource.requiredMessage));
			return subrubric;
		});
		model.checkedSubRubrics(checkedSubRubrics);
		model.selectedRubric(parent.dictionary.rubric.findById(model.checkedSubRubrics()[0].parentId));
	};

	model.get = function () {
		backend.get(model.api() + '/resume/' + parent.resumeId + '/position').success(function (data) {
			model.fromJS(data);
		});
		backend.get(model.api() + '/resume/' + parent.resumeId + '/rubric').success(function (data) {
			model.rubricsFromJS(data);
		});
	};

	model.save = function () {
		var checkedSubRubricsCount = model.checkedSubRubrics().length;
		var checkedSubRubricsWithSelectedExperienceCount = model.checkedSubRubrics().filter(function (item) {
			return item.selectedExperienceOption();
		}).length;

		if (checkedSubRubricsCount === 0) {
			model.selectedRubric(undefined);
		}

		if (checkedSubRubricsCount !== checkedSubRubricsWithSelectedExperienceCount) {
			model.checkedSubRubrics().filter(function (item) {
				return !item.experienceId || !item.experienceId();
			}).forEach(function (item) {
				if (!item.errors) {
					item.errors = ko.validation.group(item);
				}
				item.errors.showAllMessages(true);
			});
		}

		if (model.errors().length === 0 && checkedSubRubricsCount > 0 && checkedSubRubricsCount === checkedSubRubricsWithSelectedExperienceCount) {
			backend.post(model.api() + '/resume/' + parent.resumeId + '/position', model.toJS())
				.success(function (id) {
					model.id(id);
					model.commit();
					model.successMessage(model.resource.successSave.label());
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});

			var rubricData = model.checkedSubRubrics().map(function (item) {
				return {id: item.id, experienceId: item.selectedExperienceOption().id};
			});

			backend.post(model.api() + '/resume/' + parent.resumeId + '/rubric', rubricData)
				.success(function (id) {
					model.id(id);
					model.commit();
					model.successMessage(model.resource.successSave.label());
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		} else {
			model.errors.showAllMessages(true);
		}
	};

	if (data) model.fromJS(data);
	if (rubrics) model.rubricsFromJS(rubrics);

	InitEditableModel(model, 'position');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);
}
