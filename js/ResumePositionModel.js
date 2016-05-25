function ResumePositionModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resumeId = parent.resumeId;
	model.api = parent.api + '/resume/' + parent.resumeId + '/position';

	model.id = ko.observable();
	model.position = ko.observable().extend({required: true});
	model.experienceId = ko.observable().extend({required: true});
	model.scheduleId = ko.observable().extend({required: true});
	model.salary = ko.observable();
	model.currencyId = ko.observable();

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

	model.resource = parent.dictionary.resource;

	model.experienceOptions = parent.dictionary.experience;

	model.experience = ko.computed({
		read: function () {
			return model.experienceOptions.filter(function (item) {
				return item.id == model.experienceId();
			}).shift();
		},
		write: function (newValue) {
			model.experienceId(newValue ? newValue.id : undefined);
		}
	}).extend({required: true});

	model.selectedExperienceName = ko.computed(function () {
		return model.experience() ? model.experience().label() : '';
	});

	InitEditableModel(model, 'position');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
