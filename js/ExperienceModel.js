/* global InitEditableModel */
/* global backend */

function ResumeExperienceModel (parent, data) {
	var model = this;

	InitSimpleResponseHandler (model);

	model.id = ko.observable();
	model.position = ko.observable().extend({required: true});
	model.company = ko.observable().extend({required: true});
	model.branchId = ko.observable().extend({required: true});
	model.description = ko.observable().extend({required: true});
	model.notebookCompanyId = ko.observable().extend({required: true});
	model.startWork = ko.observable().extend({required: true});
	model.endWork = ko.observable().extend({required: true});
	model.recommendationList = ko.observableArray(data ? data.recommendationList.map(function (item) {
		return new RecommendationList(item.id, item.experienceId, item.name, item.position, item.companyName, item.email, item.phone, item.atRequest, parent.resumeId);
	}) : []);
	model.companySite = ko.observable().extend({required: true});
	model.employeesAmount = ko.observable().extend({required: true});

	model.simpleResponseHandler(data, model);

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/experience', model)
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

	function RecommendationList (id, experienceId, name, position, companyName, email, phone, atRequest, resumeId) {
		var model = this;
		model.id = ko.observable(id);
		model.experienceId = ko.observable(experienceId);
		model.name = ko.observable(name);
		model.position = ko.observable(position);
		model.companyName = ko.observable(companyName);
		model.email = ko.observable(email);
		model.phone = ko.observable(phone);
		model.atRequest = ko.observable(atRequest);
		model.resumeId = ko.observable(resumeId);
	}

	InitEditableModel(model, 'experience');
	InitBadRequestResponseHandler(model);
}
