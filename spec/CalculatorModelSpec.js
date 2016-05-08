/* global CalculatorModel */
describe('CalculatorModel', function () {
	var model;

	beforeEach(function () {
		model = new CalculatorModel();
	});

	it('should sum', function () {
		model.a(2);
		model.b(2);

		expect(model.sum()).toBe(4);
	});
});
