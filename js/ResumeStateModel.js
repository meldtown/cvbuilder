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
	model.selectedLevelOptionLabel = ko.computed(function () {
		var item = parent.dictionary.activityLevel.findById(model.level());
		return item ? item.label() : '';
	});
	model.isLevelPopupVisible = ko.observable(false);
	model.previousLevel = ko.observable();
	model.previousBranchIds = ko.observableArray();
	model.previousCompanyIds = ko.observableArray();
	model.toggleLevelPopup = function () {
		model.previousLevel(model.level());
		model.previousBranchIds(model.branchIds());
		model.previousCompanyIds(model.companyIds());
		model.isLevelPopupVisible(!model.isLevelPopupVisible());
	};
	model.cancelLevel = function () {
		model.level(model.previousLevel());
		model.branchIds(model.previousBranchIds());
		model.companyIds(model.previousCompanyIds());
		model.isLevelPopupVisible(false);
	};

	model.anonymous = ko.observable();

	model.branchIds = ko.observableArray();
	model.companyIds = ko.observableArray();
	model.itemsCompanyAndBranches = ko.observableArray();
	model.removeCompanyOrBranch = function (item) {
		model.itemsCompanyAndBranches.remove(item);
	};

	model.isVisibleToAll = ko.computed(function () {
		return model.level() === 1;
	});

	model.isVisibleOnlyToEmployeers = ko.computed(function () {
		return model.level() === 2;
	});

	model.isVisibleOnlyToOwner = ko.computed(function () {
		return model.level() === 6;
	});

	model.isVisibleToAllExcept = ko.computed(function () {
		return model.level() === 3;
	});

	model.setVisibleToAll = function () {
		model.level(1);
	};

	model.setVisibleOnlyToEmployeers = function () {
		model.level(2);
	};

	model.setVisibleOnlyToOwner = function () {
		model.level(6);
	};

	model.setVisibleToAllExcept = function () {
		model.level(3);
	};

	model.get = function () {
		backend.get(model.api + '/resume/' + parent.resumeId + '/state').success(function (data) {
			model.fromJS(data);

			if (model.branchIds().length > 0) {
				model.branchIds().forEach(function (id) {
					var branch = parent.dictionary.branch.findById(id);
					if (branch) {
						model.itemsCompanyAndBranches.push(parent.dictionary.branch.findById(id));
					}
				});
			}

			if (model.companyIds().length > 0) {
				backgend.post(model.api + '/autocomplete/company', model.companyIds()).success(function (data) {
					model.itemsCompanyAndBranches(data.map(function (item) {
						item.label = item.comanpyName;
						return item;
					}));
				});
			}

			model.itemsCompanyAndBranches.subscribe(function (newValue) {
				model.branchIds(newValue.filter(function (item) {
					return item.hasOwnProperty('id') && item.id;
				}));

				model.companyIds(newValue.filter(function (item) {
					return item.hasOwnProperty('notebookId') && item.notebookId;
				}));
			});
		});
	};

	model.save = function () {
		backend.post(model.api + '/resume/' + model.resumeId + '/state', model.toJS()).success(function () {
			model.isLevelPopupVisible(false);
		});
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);
	};
}
