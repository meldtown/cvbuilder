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
	it('should require last name', function () {
		model.personalInfo.beginEdit();
		expect(model.personalInfo.surName.isValid()).toBeTruthy();
		model.personalInfo.surName('');
		expect(model.personalInfo.surName.isValid()).toBeFalsy();
		expect(model.personalInfo.surName.error()).toBe('This field is required.');
	});
	it('should require the date birth', function () {
		model.personalInfo.beginEdit();
		expect(model.personalInfo.dateBirth.isValid()).toBeTruthy();
		model.personalInfo.dateBirth('');
		expect(model.personalInfo.dateBirth.isValid()).toBeFalsy();
		expect(model.personalInfo.dateBirth.error()).toBe('This field is required.');
	});
	it('should require sex', function () {
		model.personalInfo.beginEdit();
		expect(model.personalInfo.sex.isValid()).toBeTruthy();
		model.personalInfo.sex('');
		expect(model.personalInfo.sex.isValid()).toBeFalsy();
		expect(model.personalInfo.sex.error()).toBe('This field is required.');
	});
});

