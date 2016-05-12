/* global CalculatorModel */
describe('CalculatorModel', function () {
	var model;

	beforeEach(function () {
		jasmine.Ajax.install();
		model = new CalculatorModel();
	});

	afterEach(function () {
		jasmine.Ajax.uninstall();
	});

	it('should sum', function () {
		model.a(2);
		model.b(2);

		expect(model.sum()).toBe(4);
	});

	it('should load data from backend', function () {
		model.load();

		var request = jasmine.Ajax.requests.mostRecent();

		expect(request.url).toBe('/api/calc');
		expect(request.method).toBe('GET');
		expect(request.data()).toEqual({});

		request.respondWith({
			status: 200,
			responseText: JSON.stringify({
				a: 3,
				b: 3
			})
		});

		expect(model.a()).toBe(3);
		expect(model.b()).toBe(3);
		expect(model.sum()).toBe(6);
	});
});
