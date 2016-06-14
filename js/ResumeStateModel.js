function ResumeStateModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;
	model.resumeId = parent.resumeId;
	model.api = parent.api;

	model.viewCount = ko.observable();
	model.level = ko.observable();
	model.anonymous = ko.observable();
	model.branchIds = ko.observableArray();

	model.companyIds = ko.observableArray();
	model.companies = ko.observableArray();
	model.companies.subscribe(function (newValue) {
		var ids = newValue.map(function (item) {
			return item.notebookId;
		});

		var uniqueIds = ids.reduce(function (result, item) {
			if (result.indexOf(item) === -1) result.push(item);
			return result;
		}, []);

		model.companyIds(uniqueIds);
	});
	model.removeCompany = function (item) {
		model.companies.remove(item);
	};

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
		backend.get(model.api + '/resume/' + parent.resumeId + '/state').success(function (data) {
			model.fromJS(data);

			if (model.companyIds().length > 0) {
				backgend.post(model.api + '/autocomplete/company', model.companyIds()).success(function (data) {
					model.companies(data);
				});
			}
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
