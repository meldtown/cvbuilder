
function ResumeTraininglModel (parent, data) {
	var model = this;

	model.api = parent.api + '/resume/' + parent.resumeId + '/personal';

	model.resumeId = parent.resumeId;

	model.name = ko.observable().extend({required: true});
	model.location = ko.observable();
	model.description = ko.observable().extend({required: true});
	model.year = ko.observable().extend({required: true});

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
			backend.post(parent.api + '/resume/' + parent.resumeId + '/training', model.toJS())
				.success(function () {
					// model.id(id);
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
		backend.remove(parent.api + '/resume/' + parent.resumeId + '/training/' + model.id())
			.success(function () {
				parent.additional.remove(model);
			});
	};

	InitEditableModel(model, 'training');
	InitBadRequestResponseHandler(model);

	if (data) model.fromJS(data);
}
