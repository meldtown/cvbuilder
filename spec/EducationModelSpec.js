/* global CvBuilderModel */
describe('EducationModel', function () {
	var model, item;

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

		item = new ResumeEducationModel(model);
		model.education.push(item);
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should require schoolName', function () {
		item.beginEdit();
		expect(item.schoolName.isValid()).toBeFalsy();
		item.schoolName('Hello');
		expect(item.schoolName.isValid()).toBeTruthy();
		item.schoolName('');
		expect(item.schoolName.isValid()).toBeFalsy();
		expect(item.schoolName.error()).toBe('requiredMessage');
	});
	it('should require location', function () {
		item.beginEdit();
		expect(item.location.isValid()).toBeFalsy();
		item.location('Hello');
		expect(item.location.isValid()).toBeTruthy();
		item.location('');
		expect(item.location.isValid()).toBeFalsy();
		expect(item.location.error()).toBe('requiredMessage');
	});
	it('should be added/removed education block when add/remove button is clicked', function () {
		expect(model.isEducationBlockAdded()).toBe(true);
		item.remove();
		expect(model.isEducationBlockAdded()).toBe(false);
	});
});
