function ResumeEducationModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	
	model.resumeId = parent.resumeId;

	model.id = ko.observable();
	model.typeId = ko.observable();
	model.schoolName = ko.observable().extend({required: true});
	model.location = ko.observable().extend({required: true});
	model.speciality = ko.observable().extend({required: true});
	model.diploma = ko.observable().extend({required: true});
	model.year = ko.observable().extend({required: true});

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};

	model.typeOptions = parent.dictionary.educationType;
	model.selectedTypeOption = ko.computed({
		read: function () {
			return model.typeOptions.findById(model.typeId());
		},
		write: function (newValue) {
			model.typeId(newValue ? newValue.id : undefined);
		}
	}).extend({required: true});
	model.selectedTypeOptionLabel = ko.computed(function () {
		return model.selectedTypeOption() ? model.selectedTypeOption().label() : '';
	});

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/education', model.toJS())
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
		backend.remove(parent.api + '/resume/' + parent.resumeId + '/education/' + model.id())
			.success(function () {
				parent.education.remove(model);
			});
	};

	model.cancel = function () {
		model.rollback();
		if (!model.id()) {
			parent.education.remove(model);
		}
	};

	InitEditableModel(model, 'education');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
