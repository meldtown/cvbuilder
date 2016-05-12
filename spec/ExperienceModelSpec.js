/* global CvBuilderModel */
describe('ExperienceModel', function () {
	var model;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel();
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should require company name', function () {
		var item = model.experience()[0];
		item.beginEdit();

		item.company('');
		expect(item.company.error()).toBe('This field is required.');

		item.company('hello');
		expect(item.company.error()).toBeNull();
	});

	it('should remove unsaved items', function () {
		var count = model.experience().length;

		var item = model.addExperience();
		console.log(item);

		expect(model.experience().length).toBe(count + 1);

		item.cancel();
		expect(model.experience().length).toBe(count);
	});
});

