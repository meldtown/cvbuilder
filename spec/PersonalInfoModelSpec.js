/* global CvBuilderModel */
describe('PersonalInfoModel', function () {
	var model;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel();
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should require first name', function () {
		model.personalInfo.beginEdit();
		expect(model.personalInfo.name.isValid()).toBeTruthy();
		model.personalInfo.name('');
		expect(model.personalInfo.name.isValid()).toBeFalsy();
		expect(model.personalInfo.name.error()).toBe('This field is required.');
	});
});

