/* global CvBuilderModel */
describe('PersonalInfoModel', function () {
	var model;
	var api = 'http://api.vitaliy.rabota.ua';
	var resumeId = 3496188;
	var fakeSuccessResponse = {
		name: 'Hello',
		surName: 'World',
		middleName: 'Goodbuy',
		sex: 'Female'
	};

	beforeEach(function () {
		model = new CvBuilderModel('http://api.example.com', 123, {
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
			branch: [
				{
					id: 1,
					ru: 'branch 1',
					en: 'branch 1',
					ua: 'branch 1'
				},
				{
					id: 2,
					ru: 'branch 2',
					en: 'branch 2',
					ua: 'branch 2'
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
				}
			}
		});
	});

	describe('Validation', function () {
		it('should require first name', function () {
			model.personalInfo.beginEdit();
			model.personalInfo.name('');
			expect(model.personalInfo.name.isValid()).toBeFalsy();
			expect(model.personalInfo.name.error()).toBe('requiredMessage');
			model.personalInfo.name('acme');
			expect(model.personalInfo.name.isValid()).toBeTruthy();
		});
		it('should require last name', function () {
			model.personalInfo.beginEdit();
			model.personalInfo.surName('');
			expect(model.personalInfo.surName.isValid()).toBeFalsy();
			expect(model.personalInfo.surName.error()).toBe('requiredMessage');
			model.personalInfo.surName('acme');
			expect(model.personalInfo.surName.isValid()).toBeTruthy();
		});
		it('should require the date birth', function () {
			model.personalInfo.beginEdit();
			model.personalInfo.dateBirth('');
			expect(model.personalInfo.dateBirth.isValid()).toBeFalsy();
			expect(model.personalInfo.dateBirth.error()).toBe('requiredMessage');
			model.personalInfo.dateBirth('acme');
			expect(model.personalInfo.dateBirth.isValid()).toBeTruthy();
		});

		it('should require the date sex', function () {
			model.personalInfo.beginEdit();
			model.personalInfo.sex('');
			expect(model.personalInfo.sex.isValid()).toBeFalsy();
			expect(model.personalInfo.sex.error()).toBe('requiredMessage');
			model.personalInfo.sex('acme');
			expect(model.personalInfo.sex.isValid()).toBeTruthy();
		});
		describe('Get request', function () {
			beforeEach(function () {
				jasmine.Ajax.install();
				model.personalInfo.get();
				model.personalInfo.name('Jack');
				model.personalInfo.surName('Ruby');
				model.personalInfo.middleName('Lewis');
				model.personalInfo.dateBirth('12.12.1990');
				model.personalInfo.sex('male');
			});

			afterEach(function () {
				jasmine.Ajax.uninstall();
			});

			// it('should set correct fields for get method', function () {
			// 	var request = jasmine.Ajax.requests.mostRecent();
            //
			// 	expect(request.url).toBe(api + '/api/personal/' + resumeId);
			// 	expect(request.method).toBe('GET');
			// 	expect(request.data()).toEqual({});
            //
			// 	request.respondWith({status: 200, responseText: JSON.stringify(fakeSuccessResponse)});
			// 	expect(model.personalInfo.name()).toBe('Hello');
			// 	expect(model.personalInfo.surName()).toBe('World');
			// 	expect(model.personalInfo.middleName()).toBe('Goodbuy');
			// 	expect(model.personalInfo.sex()).toBe('Female');
			// });
			it('should be 404 for get request error', function () {
				var request = jasmine.Ajax.requests.mostRecent();
				request.respondWith({status: 404, responseText: JSON.stringify(fakeSuccessResponse)});
				// TODO expect(model.personalInfo.message).toBe('Not found');
			});
			it('should be 403 for get request error', function () {
				var request = jasmine.Ajax.requests.mostRecent();
				request.respondWith({status: 403, responseText: JSON.stringify(fakeSuccessResponse)});
				// TODO expect(model.personalInfo.message).toBe('Forbidden');
			});
			// it('should set correct fields for post method', function () {
			// 	model.personalInfo.save();
			// 	var request = jasmine.Ajax.requests.mostRecent();
			// 	expect(request.url).toBe(api + '/api/personal/' + resumeId);
			// 	expect(request.method).toBe('POST');
			// });
			it('should be 403 for post request error', function () {
				model.personalInfo.save();
				var request = jasmine.Ajax.requests.mostRecent();
				request.respondWith({status: 403, responseText: JSON.stringify(fakeSuccessResponse)});
				// TODO expect(model.personalInfo.message).toBe('Forbidden');
			});
			it('should be 400 for post request error', function () {
				// model.personalInfo.beginEdit();
				// expect(model.personalInfo.errors().length).toBe(0);
				// model.personalInfo.save();
                //
				// var request = jasmine.Ajax.requests.mostRecent();
				// console.log(request.url);
				// request.respondWith({status: 400, responseText: JSON.stringify({
				// 	modelState: {
				// 		'data.Name': 'Name required'
				// 	}
				// })});
                //
				// expect(model.personalInfo.name.isValid()).toBeFalsy();
				// expect(model.personalInfo.name.error()).toBe('Name required');
				// TODO expect(model.personalInfo.message).toBe('Forbidden');
			});
		});
	});
});
