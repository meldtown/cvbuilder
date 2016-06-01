function ResumeExperienceModel (parent, data) {
	var model = this;

	model.resumeId = parent.resumeId;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;

	model.id = ko.observable();
	model.position = ko.observable().extend({required: true});
	model.company = ko.observable().extend({required: true});
	model.branchId = ko.observable().extend({required: true});
	model.description = ko.observable().extend({required: true});
	model.notebookCompanyId = ko.observable().extend({required: true});
	model.startWork = ko.observable().extend({required: true});
	model.endWork = ko.observable().extend({required: true});
	model.recommendationList = ko.observableArray();
	model.companySite = ko.observable();
	model.employeesAmount = ko.observable();

	model.startWorkFormatted = ko.computed(function () {
		moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
		return moment(model.startWork()).format('LL');
	});

	model.endWorkFormatted = ko.computed(function () {
		moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
		return moment(model.endWork()).format('LL');
	});

	model.workPeriodFormatted = ko.computed(function () {
		moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
		return moment.duration(moment(model.endWork()) - moment(model.startWork())).humanize();
	});


	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);

		model.startWork(data.startWork);
		model.endWork(data.endWork);
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
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		}
	};

	model.remove = function () {
		backend.remove(parent.api + '/resume/' + parent.resumeId + '/experience/' + model.id())
			.success(function () {
				parent.experience.remove(model);
			});
	};

	model.cancel = function () {
		model.rollback();
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
	});

	model.selectedBranchOptionLabel = ko.computed(function () {
		return model.selectedBranchOption() ? model.selectedBranchOption().label() : '';
	});

	model.addRecommendation = function () {
		model.additionalPhones.push(new ResumeExperienceRecommendationModel(model));
		model.edit();
	};

	InitEditableModel(model, 'experience');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}

function ResumeExperienceRecommendationModel (parent, data) {
	var model = this;

	model.id = ko.observable();
	model.experienceId = ko.observable();
	model.name = ko.observable();
	model.position = ko.observable();
	model.companyName = ko.observable();
	model.email = ko.observable();
	model.phone = ko.observable();
	model.atRequest = ko.observable();
	model.resumeId = parent.resumeId;

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.remove = function (item) {
		parent.recommendationList.remove(item);
		parent.save();
	};

	if (data) model.fromJS(data);

	InitEditableModel(model, 'recommendation');
}
