function ExperienceModel (id, company, position) {
	var model = this;

	model.id = ko.observable(id);
	model.company = ko.observable(company).extend({required: true});
	model.position = ko.observable(position).extend({required: true});

	InitEditableModel(model, 'experience');
}
