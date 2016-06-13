/* global CvBuilderModel */
describe('ContactsModel', function () {
	var model;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel('http://api.example.com', 123, {
			activityLevel: [
				{
					id: 1,
					ru: 'activity level 1',
					en: 'activity level 1',
					ua: 'activity level 1'
				},
				{
					id: 2,
					ru: 'activity level 2',
					en: 'activity level 2',
					ua: 'activity level 2'
				}
			],
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
				addPhoto: {
					ru: 'addPhoto',
					en: 'addPhoto',
					ua: 'addPhoto'
				},
				percentMore: {
					ru: 'percentMore',
					en: 'percentMore',
					ua: 'percentMore'
				}
			}
		});
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should check email', function () {
		model.contacts.beginEdit();

		model.contacts.email('hello');
		expect(model.contacts.email.error()).toBe('wrongFormat');

		model.contacts.email('hello@example.com');
		expect(model.contacts.email.error()).toBeNull();
	});
});
