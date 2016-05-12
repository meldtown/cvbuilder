/* global InitEditableModel */
function ExperienceModel (parent, id, company, position) {
	var model = this;

	model.id = ko.observable(id);
	model.company = ko.observable(company).extend({required: true});
	model.position = ko.observable(position).extend({required: true});

	model.save = function () {
		if (model.errors().length === 0) {
			// ajax call will be here
			model.id(getNextId());
			model.commit();
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
