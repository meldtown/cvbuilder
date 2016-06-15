/* global CvBuilderModel */
describe('ExperienceModel', function () {
	var model, item;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel('http://api.example.com', 123, getDummyDictionary());

		item = new ResumeExperienceModel(model);
		model.experience.push(item);
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should require company name', function () {
		item.beginEdit();

		item.company('');
		expect(item.company.error()).toBe('requiredMessage');

		item.company('hello');
		expect(item.company.error()).toBeNull();
	});

	it('should remove unsaved items', function () {
		var count = model.experience().length;
		var item = model.addExperience();
		expect(model.experience().length).toBe(count + 1);
		item.cancel();
		// expect(model.experience().length).toBe(count);
	});
});

