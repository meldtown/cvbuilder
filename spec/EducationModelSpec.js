describe('EducationModel', function () {
	var model;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel();
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should require schoolName', function () {
		var item = model.education()[0];
		item.beginEdit();
		expect(item.schoolName.isValid()).toBeTruthy();
		item.schoolName('');
		expect(item.schoolName.isValid()).toBeFalsy();
		expect(item.schoolName.error()).toBe('This field is required.');
	});
	it('should require location', function () {
		var item = model.education()[0];
		item.beginEdit();
		expect(item.location.isValid()).toBeTruthy();
		item.location('');
		expect(item.location.isValid()).toBeFalsy();
		expect(item.location.error()).toBe('This field is required.');
	});
	it('should require diploma', function () {
		var item = model.education()[0];
		item.beginEdit();
		expect(item.diploma.isValid()).toBeTruthy();
		item.diploma('');
		expect(item.diploma.isValid()).toBeFalsy();
		expect(item.diploma.error()).toBe('This field is required.');
	});
	it('should require speciality', function () {
		var item = model.education()[0];
		item.beginEdit();
		expect(item.speciality.isValid()).toBeTruthy();
		item.speciality('');
		expect(item.speciality.isValid()).toBeFalsy();
		expect(item.speciality.error()).toBe('This field is required.');
	});
	it('should be speciality and diploma be disabled if secondary have been selected', function () {
		var item = model.education()[0];
		item.selectedType('secondary');
		expect(item.isSecondaryTypeSelected()).toBe(true);
	});
	it('should be added/removed education block when add/remove button is clicked', function () {
		model.addEducationBlock();
		expect(model.educationBlockHasAdded()).toBe(true);
		model.removeEducationBlock();
		expect(model.educationBlockHasAdded()).toBe(false);
	});
});
