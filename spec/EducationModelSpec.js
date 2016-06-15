/* global CvBuilderModel */
describe('EducationModel', function () {
	var model, item;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel('http://api.example.com', 123, getDummyDictionary());

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
