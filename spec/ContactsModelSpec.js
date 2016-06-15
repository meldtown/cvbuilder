/* global CvBuilderModel */
describe('ContactsModel', function () {
	var model;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CvBuilderModel('http://api.example.com', 123, getDummyDictionary());
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
