function ResumeExperienceModel (parent, data) {
	var model = this;

	model.id = ko.observable();
	model.position = ko.observable().extend({required: true});
	model.company = ko.observable().extend({required: true});
	model.branchId = ko.observable().extend({required: true});
	model.description = ko.observable().extend({required: true});
	model.notebookCompanyId = ko.observable().extend({required: true});
	model.startWork = ko.observable().extend({required: true});
	model.endWork = ko.observable().extend({required: true});
	model.recommendationList = ko.observableArray();
	model.companySite = ko.observable().extend({required: true});
	model.employeesAmount = ko.observable().extend({required: true});

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

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	model.toJS = function () {
		mapper.toJS(model);
	};

	if (data) model.fromJS(data);
}