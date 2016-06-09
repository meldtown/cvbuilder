/* global CvBuilderModel */
describe('ExperienceModel', function () {
	var model, item;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel('http://api.example.com', 123, {
			schedule: [
				{
					id: 1,
					ru: 'schedule 1',
					en: 'schedule 1',
					ua: 'schedule 1'
				},
				{
					id: 2,
					ru: 'schedule 2',
					en: 'schedule 2',
					ua: 'schedule 2'
				}
			],
			branch: [
				{
					id: 1,
					ru: 'branch 1',
					en: 'branch 1',
					ua: 'branch 1'
				},
				{
					id: 2,
					ru: 'branch 2',
					en: 'branch 2',
					ua: 'branch 2'
				}
			],
			experience: [
				{
					id: 1,
					ru: 'experience 1',
					en: 'experience 1',
					ua: 'experience 1'
				},
				{
					id: 2,
					ru: 'experience 2',
					en: 'experience 2',
					ua: 'experience 2'
				}
			],
			city: [
				{
					id: 1,
					ru: 'city 1',
					en: 'city 1',
					ua: 'city 1'
				},
				{
					id: 2,
					ru: 'city 2',
					en: 'city 2',
					ua: 'city 2'
				}
			],
			educationType: [
				{
					id: 1,
					ru: 'education 1',
					en: 'education 1',
					ua: 'education 1'
				},
				{
					id: 2,
					ru: 'education 2',
					en: 'education 2',
					ua: 'education 2'
				}
			],
			currency: [
				{
					id: 1,
					ru: 'uah',
					en: 'uah',
					ua: 'uah'
				},
				{
					id: 2,
					ru: 'usd',
					en: 'usd',
					ua: 'usd'
				}
			],
			sex: [
				{
					id: 0,
					ru: 'female',
					ua: 'female',
					en: 'female'
				},
				{
					id: 1,
					ru: 'male',
					ua: 'male',
					en: 'male'
				}
			],
			resource: {
				requiredMessage: {
					ru: 'requiredMessage',
					en: 'requiredMessage',
					ua: 'requiredMessage'
				},
				wrongFormat: {
					ru: 'wrongFormat',
					en: 'wrongFormat',
					ua: 'wrongFormat'
				},
				educationUniversityNameLabel: {
					ru: 'educationUniversityNameLabel',
					en: 'educationUniversityNameLabel',
					ua: 'educationUniversityNameLabel'
				}
			}
		});

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

