ko.validation.init({
	decorateElement: true
});

function InitEditableModel (model, templatePrefix) {
	ko.editable(model);
	model.errors = ko.validation.group(model);
	model.tpl = ko.computed(function () {
		return model.inTransaction() ? templatePrefix + '-form' : templatePrefix + '-view';
	});
}
