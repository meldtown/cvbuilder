function ResumeContactsModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;

	model.resumeId = parent.resumeId;

	model.phone = ko.observable().extend({required: true});
	model.additionalPhones = ko.observableArray();
	model.email = ko.observable().extend({required: true, email: true});
	model.skype = ko.observable();
	model.portfolio = ko.observableArray();
	model.socialNetworks = ko.observableArray();

	model.getSocialNetworkBySubType = function (subType) {
		return model.socialNetworks().filter(function (item) {
			return item.subTypeAsString() === (subType || '').toString();
		}).shift();
	};

	model.toggleSocialNetwork = function (subType) {
		var socialNetwork = model.getSocialNetworkBySubType(subType);

		if (socialNetwork) {
			model.socialNetworks.remove(socialNetwork);
		} else {
			model.socialNetworks.push(new ResumeContactsSocialNetworkModel(model, {
				type: 'SocialNetwork',
				subType: subType
			}));
		}
	};

	model.toggleLinkedin = function () {
		model.toggleSocialNetwork('1');
	};

	model.toggleFacebook = function () {
		model.toggleSocialNetwork('2');
	};

	model.toggleVk = function () {
		model.toggleSocialNetwork('3');
	};

	model.toggleTwitter = function () {
		model.toggleSocialNetwork('4');
	};

	model.toggleGooglePlus = function () {
		model.toggleSocialNetwork('5');
	};

	model.toggleOdnoklasniki = function () {
		model.toggleSocialNetwork('6');
	};

	model.socialNetworksActiveClass = 'btn btn-primary btn-small';
	model.socialNetworksDefaultClass = 'btn btn-danger btn-small';

	model.linkedinClass = ko.computed(function () {
		return model.getSocialNetworkBySubType('1') ? model.socialNetworksActiveClass : model.socialNetworksDefaultClass;
	});

	model.facebookClass = ko.computed(function () {
		return model.getSocialNetworkBySubType('2') ? model.socialNetworksActiveClass : model.socialNetworksDefaultClass;
	});

	model.vkClass = ko.computed(function () {
		return model.getSocialNetworkBySubType('3') ? model.socialNetworksActiveClass : model.socialNetworksDefaultClass;
	});

	model.twitterClass = ko.computed(function () {
		return model.getSocialNetworkBySubType('4') ? model.socialNetworksActiveClass : model.socialNetworksDefaultClass;
	});

	model.googlePlusClass = ko.computed(function () {
		return model.getSocialNetworkBySubType('5') ? model.socialNetworksActiveClass : model.socialNetworksDefaultClass;
	});

	model.odnoklasnikiClass = ko.computed(function () {
		return model.getSocialNetworkBySubType('6') ? model.socialNetworksActiveClass : model.socialNetworksDefaultClass;
	});

	model.toJS = function () {
		var data = mapper.toJS(model);
		data.socialNetworks = data.socialNetworks.filter(function (item) {
			return item.text.trim().length > 0;
		});
		return data;
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);

		model.additionalPhones(data.additionalPhones.map(function (item) {
			return new ResumeContactsAdditionalPhoneModel(model, item);
		}));

		model.socialNetworks(data.socialNetworks.map(function (item) {
			return new ResumeContactsSocialNetworkModel(model, item);
		}));
	};

	model.get = function () {
		backend.get(parent.api + '/resume/' + parent.resumeId + '/contact').success(function (data) {
			model.fromJS(data);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			backend.post(parent.api + '/resume/' + parent.resumeId + '/contact', model.toJS())
				.success(function () {
					model.commit();
					model.additionalPhones().forEach(function (item) {
						item.commit();
					});
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		}
	};

	model.edit = function () {
		model.beginEdit();
		model.additionalPhones().forEach(function (item) {
			item.beginEdit();
		});
	};

	model.cancel = function () {
		model.rollback();
		model.additionalPhones().forEach(function (item) {
			item.rollback();
		});
	};

	model.addAdditionalPhone = function () {
		model.additionalPhones.push(new ResumeContactsAdditionalPhoneModel(model));
		model.edit();
	};

	InitEditableModel(model, 'contacts');
	InitBadRequestResponseHandler(model);
}

function ResumeContactsAdditionalPhoneModel (parent, data) {
	var model = this;

	model.phone = ko.observable(data);
	model.resource = parent.resource;

	model.toJS = function () {
		return model.phone();
	};

	model.fromJS = function (data) {
		if (!data) return;

		model.phone(data);
	};

	model.remove = function (item) {
		parent.additionalPhones.remove(item);
		parent.save();
	};

	InitEditableModel(model, 'phone');
}

function ResumeContactsSocialNetworkModel (parent, data) {
	var model = this;

	model.resource = parent.resource;
	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resumeId = parent.resumeId;
	model.type = '3';
	model.subType = ko.observable();

	model.subTypeAsString = ko.computed(function () {
		return (model.subType() || '').toString();
	});

	model.subTypeLabel = ko.computed(function () {
		if (model.subTypeAsString() === '1') return 'LinkedIn';
		else if (model.subTypeAsString() === '2') return 'Facebook';
		else if (model.subTypeAsString() === '3') return 'Vkontakte';
		else if (model.subTypeAsString() === '4') return 'Twitter';
		else if (model.subTypeAsString() === '5') return 'Goolge+';
		else if (model.subTypeAsString() === '6') return 'Odnoklasniki';
		return '';
	});

	model.text = ko.observable().extend({
		required: {
			params: true,
			message: function (params, observable) {
				return model.resource.requiredMessage.label();
			}
		},
		validation: {
			validator: function (val) {
				var text = val.replace('http://', '').replace('https://', '');
				var domain = '';
				if (model.subTypeAsString() === '1') domain = 'linkedin.com';
				else if (model.subTypeAsString() === '2') domain = 'facebook.com';
				else if (model.subTypeAsString() === '3') domain = 'vk.com';
				else if (model.subTypeAsString() === '4') domain = 'twitter.com';
				else if (model.subTypeAsString() === '5') domain = 'plus.google.com';
				else if (model.subTypeAsString() === '6') domain = 'ok.ru';

				return text.indexOf(domain) === 0;
			},
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});

	model.toJS = function () {
		var data = mapper.toJS(model);
		data.type = '3'; // prevent any other type other than social network
		return data;
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);
	};

	if (data) model.fromJS(data);
}
