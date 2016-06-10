function ResumeExperienceModel (parent, data) {
	var model = this;

	model.resumeId = parent.resumeId;

	model._api = ko.computed(function () {
		return parent.api;
	});

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model._keywordsApiUrl = ko.computed(function () {
		return parent.api + '/autocomplete/keyword';
	});

	model._companyApiUrl = ko.computed(function () {
		return parent.api + '/autocomplete/company';
	});

	model._branch = parent.dictionary.branch;

	model.resource = parent.dictionary.resource;

	model.id = ko.observable();
	model.position = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.company = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.branchId = ko.observable();
	model.branch = ko.computed(function () {
		var data = parent.dictionary.branch.findById(model.branchId());
		return data ? data.label() : '';
	});
	model.description = ko.observable();
	model.notebookCompanyId = ko.observable();
	model.startWork = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.endWork = ko.observable().extend({
		validation: {
			validator: function (val) {
				if (val && val !== '1900-01-01T00:00:00') {
					return moment(val).isAfter(moment(model.startWork()));
				} else {
					return true;
				}
			},
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});
	model.recommendationList = ko.observableArray();
	model.companySite = ko.observable();
	model.employeesAmount = ko.observable();

	model.startWorkFormatted = ko.computed(function () {
		moment.locale(model._lng().moment);
		return moment(model.startWork()).format('LL');
	});

	model.endWorkFormatted = ko.computed(function () {
		if (model.endWork() === '1900-01-01T00:00:00') return model.resource.tillNow.label();
		moment.locale(model._lng().moment);
		return moment(model.endWork()).format('LL');
	});

	model.workPeriodFormatted = ko.computed(function () {
		moment.locale(model._lng().moment);
		return moment.duration(moment(model.endWork()) - moment(model.startWork())).humanize();
	});

	model.isAddRecomendationButtonVisible = ko.computed(function () {
		return model.recommendationList().length < 3;
	});

	model.toJS = function () {
		var data = mapper.toJS(model);
		data.description = data.description || '';
		return data;
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);

		model.recommendationList(data.recommendationList.map(function (item) {
			return new ResumeExperienceRecommendationModel(model, item);
		}));
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/experience', model.toJS())
				.success(function (id) {
					model.id(id);
					model.commit();
					model.recommendationList().forEach(function (item) {
						item.commit();
					});
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

	model.remove = function () {
		if (model.id()) {
			backend.remove(parent.api + '/resume/' + parent.resumeId + '/experience/' + model.id())
				.success(function () {
					parent.experience.remove(model);
				});
		} else {
			parent.experience.remove(model);
		}
	};

	model.edit = function () {
		model.beginEdit();
		model.recommendationList().forEach(function (item) {
			item.beginEdit();
		});
	};

	model.cancel = function () {
		model.rollback();
		model.recommendationList().forEach(function (item) {
			item.rollback();
		});
		if (!model.id()) {
			model.remove();
		}
	};

	model.branchOptions = parent.dictionary.branch;
	model.selectedBranchOption = ko.computed({
		read: function () {
			return model.branchOptions.findById(model.branchId());
		},
		write: function (newValue) {
			model.branchId(newValue ? newValue.id : undefined);
		}
	}).extend(utils.requiredOnly(model.resource.requiredMessage));

	model.selectedBranchOptionLabel = ko.computed(function () {
		return model.selectedBranchOption() ? model.selectedBranchOption().label() : '';
	});

	model.addRecommendation = function () {
		model.recommendationList.push(new ResumeExperienceRecommendationModel(model));
		model.edit();
	};

	InitEditableModel(model, 'experience');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}

function ResumeExperienceRecommendationModel (parent, data) {
	var model = this;

	model._branch = parent._branch;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model._companyApiUrl = ko.computed(function () {
		return parent._companyApiUrl();
	});

	model._keywordsApiUrl = ko.computed(function () {
		return parent._keywordsApiUrl();
	});

	model.resource = parent.resource;

	model.id = ko.observable();
	model.experienceId = ko.observable();
	model.name = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.position = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.companyName = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.email = ko.observable().extend({
		email: {
			params: true,
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});
	model.phone = ko.observable().extend({
		pattern: {
			params: '^[0-9\\-\\+\\(\\)\\ ]+.$',
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});
	model.atRequest = ko.observable();
	model.resumeId = parent.resumeId;

	model.blockTitleLabel = ko.computed(function () {
		return parent.resource.recommendationRubricNameLabel.label().replace('1', (parent.recommendationList.indexOf(model) + 1));
	});

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.remove = function (item) {
		if (model.id()) {
			backend.remove(parent._api() + '/resume/' + parent.resumeId + '/experience/' + parent.id() + '/recommendation/' + model.id())
				.success(function () {
					parent.recommendationList.remove(item);
				});
		} else {
			parent.recommendationList.remove(item);
		}
	};

	if (data) model.fromJS(data);

	InitEditableModel(model, 'recommendation');
}
