function ResumeStateModel (parent, data) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});

	model.resumeId = parent.resumeId;

	model.viewCount = ko.observable();
	model.level = ko.observable();
	model.selectedLevelOptionLabel = ko.computed(function () {
		var item = parent.dictionary.activityLevel.findById(model.level());
		return item ? item.label() : '';
	});
	model.previousLevel = ko.observable();
	model.previousBranchIds = ko.observableArray();
	model.previousCompanyIds = ko.observableArray();

	model.isLevelPopupOpen = ko.observable(false);
	model.cancelLevel = function () {
		model.isLevelPopupOpen(false);
	};
	model.isLevelPopupOpen.subscribe(function (newValue) {
		if (newValue === false) {
			if (model.previousLevel()) {
				model.level(model.previousLevel());
				model.branchIds(model.previousBranchIds());
				model.companyIds(model.previousCompanyIds());
			}
		} else if (newValue === true) {
			model.previousLevel(model.level());
			model.previousBranchIds(model.branchIds());
			model.previousCompanyIds(model.companyIds());
		}
	});

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

	model.levelLogoClass = ko.computed(function () {
		if (model.isVisibleToAll()) return 'fa fa-globe';
		if (model.isVisibleOnlyToEmployeers()) return 'fa fa-briefcase';
		if (model.isVisibleOnlyToOwner()) return 'fa fa-lock';
		if (model.isVisibleToAllExcept()) return 'fa fa-filter';
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
		backend.get(model.api() + '/resume/' + parent.resumeId + '/state').success(function (data) {
			model.fromJS(data);
		});
	};

	model.save = function () {
		backend.post(model.api() + '/resume/' + model.resumeId + '/state', model.toJS()).success(function () {
			model.previousLevel(null);
			model.isLevelPopupOpen(false);
		});
	};

	model.makeAvailable = function () {
		model.setVisibleToAll();
		model.save();
	};

	model.toJS = function () {
		var data = mapper.toJS(model);

		data.branchIds = model.itemsCompanyAndBranches().filter(function (item) {
			return item.hasOwnProperty('id') && item.id;
		}).map(function (item) {
			return item.id;
		});

		data.companyIds = model.itemsCompanyAndBranches().filter(function (item) {
			return item.hasOwnProperty('notebookId') && item.notebookId;
		}).map(function (item) {
			return item.notebookId;
		});

		delete data.itemsCompanyAndBranches;

		return data;
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);

		if (data.branchIds.length > 0) {
			data.branchIds.forEach(function (id) {
				var branch = parent.dictionary.branch.findById(id);
				if (branch) {
					model.itemsCompanyAndBranches.push(parent.dictionary.branch.findById(id));
				}
			});
		}

		if (data.companyIds.length > 0) {
			backend.post(model.api() + '/autocomplete/company', data.companyIds).success(function (data) {
				data.map(function (item) {
					item.label = item.companyName;
					return item;
				}).forEach(function (item) {
					model.itemsCompanyAndBranches.push(item);
				});
			});
		}
	};

	if (data) {
		model.fromJS(data);
	}
}
