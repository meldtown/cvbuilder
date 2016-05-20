/* global InitEditableModel */
function ExperienceModel (parent, data) {
	var model = this;
	model.id = ko.observable(data ? data.id : 0);
	model.position = ko.observable(data ? data.position : '').extend({required: true});
	model.company = ko.observable(data ? data.company : '').extend({required: true});
	model.branchId = ko.observable(data ? data.branchId : 1).extend({required: true});
	model.description = ko.observable(data ? data.description : '').extend({required: true});
	model.notebookCompanyId = ko.observable(data ? data.notebookCompanyId : 0).extend({required: true});
	model.period = ko.observable(data ? data.period : '25 {1}').extend({required: true});
	model.startWork = ko.observable(data ? data.startWork : '10.10.2000').extend({required: true});
	model.endWork = ko.observable(data ? data.endWork : '10.10.2010').extend({required: true});
	model.recommendationList = ko.observableArray(data ? data.recommendationList.map(function (item) {
		return new RecommendationList(item.id, item.experienceId, item.name, item.position, item.companyName, item.email, item.phone, item.atRequest, item.resumeId);
	}) : []);
	model.companySite = ko.observable(data ? data.companySite : '').extend({required: true});
	model.employeesAmount = ko.observable(data ? data.employeesAmount : 0).extend({required: true});
	model.resumeId = ko.observable(parent.resumeId).extend({required: true});
	model.save = function () {
		// if (model.errors().length === 0) {
		$.ajax({
			type: 'POST',
			url: parent.api + '/resume/' + parent.resumeId + '/experience',
			data: JSON.stringify(
				{
					id: model.id(),
					position: model.position(),
					company: model.company(),
					branchId: model.branchId(),
					description: model.description(),
					notebookCompanyId: model.notebookCompanyId(),
					period: model.period(),
					startWork: model.startWork(),
					endWork: model.endWork(),
					companySite: model.companySite(),
					resumeId: model.resumeId(),
					recommendationList: model.recommendationList()
				}
			),
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function (id) {
			model.id(id);
			console.log(id);
			model.commit();
		}).fail(function (jqXHR) {
			console.log(jqXHR);
			// if (jqXHR.status === 400) {
			// 	var errors = JSON.parse(jqXHR.responseText);
			//
			// 	if (errors.hasOwnProperty('modelState')) {
			// 		if (errors.modelState['data.Name']) {
			// 			model.name.setError(errors.modelState['data.Name']);
			// 		}
			//
			// 		if (errors.modelState['data.SurName']) {
			// 			model.surName.setError(errors.modelState['data.SurName']);
			// 		}
			//
			// 		if (errors.modelState['data.middleName']) {
			// 			model.surName.setError(errors.modelState['data.middleName']);
			// 		}
			//
			// 		if (errors.modelState['data.dateBirth']) {
			// 			model.surName.setError(errors.modelState['data.dateBirth']);
			// 		}
			//
			// 		if (errors.modelState['data.sex']) {
			// 			model.name.setError(errors.modelState['data.sex']);
			// 		}
			//
			// 		model.errors.showAllMessages(true);
			// 	}
			// }
		});
		// }
	};

	model.remove = function () {
		$.ajax({
			type: 'DELETE',
			url: parent.api + '/resume/' + parent.resumeId + '/experience/' + model.id(),
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).success(function () {
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

	/**
	 * I'm a temporary function to calculate next sequence
	 * @returns {number}
	 */
	// function getNextId () {
	// 	var ids = parent.experience().map(function (item) {
	// 		return item.id() || 0;
	// 	});
	// 	var max = Math.max.apply(null, ids);
	// 	return 1 + max;
	// }
}
