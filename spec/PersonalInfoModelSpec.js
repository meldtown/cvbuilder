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

		expect(model.personalInfo.firstName.isValid()).toBeTruthy();
		model.personalInfo.firstName('');
		expect(model.personalInfo.firstName.isValid()).toBeFalsy();

		model.personalInfo.firstName('Alexandr');
		model.personalInfo.save();
		expect(model.personalInfo.firstName.isValid()).toBeFalsy();
		expect(model.personalInfo.firstName.error()).toBe('Already taken');
	});
});

