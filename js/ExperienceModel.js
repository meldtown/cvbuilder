/* global InitEditableModel */
function ExperienceModel (parent, data) {
	var model = this;

	model.id = ko.observable(data.id);
	model.position = ko.observable(data.position).extend({required: true});
	model.company = ko.observable(data.company).extend({required: true});
	model.branchId = ko.observable(data.branchId).extend({required: true});
	model.description = ko.observable(data.description).extend({required: true});
	model.notebookCompanyId = ko.observable(data.notebookCompanyId).extend({required: true});
	model.period = ko.observable(data.period).extend({required: true});
	model.startWork = ko.observable(data.startWork).extend({required: true});
	model.endWork = ko.observable(data.endWork).extend({required: true});
	model.companySite = ko.observable(data.companySite).extend({required: true});
	model.resumeId = ko.observable(data.resumeId).extend({required: true});
	// model.recommendationList = new RecommendationList(params);
	model.save = function () {
		if (model.errors().length === 0) {
			$.ajax({
				type: 'POST',
				url: parent.api + '/api/personal/' + parent.resumeId,
				data: JSON.stringify(
					{
						name: model.name(),
						middleName: model.middleName(),
						surName: model.surName(),
						dateBirth: model.dateBirth(),
						sex: model.sex(),
						cityId: 1,
						resumeId: parent.resumeId
					}
				),
				contentType: 'application/json',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			}).success(function (data) {
				model.name(data.name);
				model.middleName(data.middleName);
				model.surName(data.surName);
				model.dateBirth(data.dateBirth);
				model.sex(data.sex);

				console.log(data);
				model.commit();
			}).fail(function (jqXHR) {
				console.log(jqXHR);
				if (jqXHR.status === 400) {
					var errors = JSON.parse(jqXHR.responseText);

					if (errors.hasOwnProperty('modelState')) {
						if (errors.modelState['data.Name']) {
							model.name.setError(errors.modelState['data.Name']);
						}

						if (errors.modelState['data.SurName']) {
							model.surName.setError(errors.modelState['data.SurName']);
						}

						if (errors.modelState['data.middleName']) {
							model.surName.setError(errors.modelState['data.middleName']);
						}

						if (errors.modelState['data.dateBirth']) {
							model.surName.setError(errors.modelState['data.dateBirth']);
						}

						if (errors.modelState['data.sex']) {
							model.name.setError(errors.modelState['data.sex']);
						}

						model.errors.showAllMessages(true);
					}
				}
			});
		}
	};

	model.remove = function () {
		// ajax call will be here
		parent.experience.remove(model);
	};

	model.cancel = function () {
		model.rollback();
		if (!model.id()) {
			model.remove();
		}
	};
	// function RecommendationList (id, experienceId, name, position, companyName, email, phone, atRequest, resumeId) {
	// 	var model = this;
	// }

	InitEditableModel(model, 'experience');

	/**
	 * I'm a temporary function to calculate next sequence
	 * @returns {number}
	 */
	function getNextId () {
		var ids = parent.experience().map(function (item) {
			return item.id() || 0;
		});
		var max = Math.max.apply(null, ids);
		return 1 + max;
	}
}
