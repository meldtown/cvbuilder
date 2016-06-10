function ResumeStateModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	model.resumeId = parent.resumeId;
	model.api = parent.api + '/resume/' + parent.resumeId + '/state';

	model.viewCount = ko.observable();
	model.level = ko.observable();
	model.anonymous = ko.observable();
	model.branchIds = ko.observableArray();
	model.companyIds = ko.observableArray();

	model.levelOptions = parent.dictionary.activityLevel;
	model.selectedLevelOption = ko.computed({
		read: function () {
			return model.levelOptions.findById(model.level());
		},
		write: function (newValue) {
			model.level(newValue ? newValue.id : undefined);
		}
	});
	model.selectedLevelOptionLabel = ko.computed(function () {
		return model.selectedLevelOption() ? model.selectedLevelOption().label() : '';
	});

	model.get = function () {
		backend.get(model.api).success(function (data) {
			model.fromJS(data);
		});
	};

	model.save = function () {
		backend.post(model.api, model.toJS());
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};
}
