/* global CvBuilderModel */
describe('ContactsModel', function () {
	var model;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel();
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should check email', function () {
		model.contacts.beginEdit();

		model.contacts.email('hello');
		expect(model.contacts.email.error()).toBe('Please enter a proper email address.');

		model.contacts.email('hello@example.com');
		expect(model.contacts.email.error()).toBeNull();
	});
});
