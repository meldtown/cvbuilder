function ResumeContactsModel (parent) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.resource = parent.dictionary.resource;

	model.resumeId = parent.resumeId;

	model.phone = ko.observable().extend({
		pattern: {
			params: '^[0-9\\-\\+\\(\\)\\ ]+.$',
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});
	model.additionalPhones = ko.observableArray();
	model.email = ko.observable().extend({
		required: utils.required(model.resource.requiredMessage),
		email: {
			params: true,
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});
	model.skype = ko.observable();
	model.portfolio = ko.observableArray();
	model.socialNetworks = ko.observableArray();

	model.isAdditionalPhonesBlockVisibleView = ko.computed(function () {
		return model.phone() && model.additionalPhones().length > 0;
	});

	model.isAdditionalPhonesBlockVisibleForm = ko.computed(function () {
		return model.phone() && model.phone.isValid();
	});

	model.emailHref = ko.computed(function () {
		return 'mailto:' + model.email();
	});

	model.skypeHref = ko.computed(function () {
		return 'skype:' + model.skype();
	});

	model.nonEmptyPortfolio = ko.computed(function () {
		return model.portfolio().filter(function (item) {
			return item.portfolio() && item.portfolio().length > 0;
		});
	});

	model.isPortfoliodBlockVisible = ko.computed(function () {
		return model.nonEmptyPortfolio().length > 0;
	});

	model.nonEmptySocialNetworks = ko.computed(function () {
		return model.socialNetworks().filter(function (item) {
			return item.text() && item.text().length > 0;
		});
	});

	model.isSocialNetworksBlockVisible = ko.computed(function () {
		return model.nonEmptySocialNetworks().length > 0;
	});

	model.removeBadOrEmptyAdditionalPhones = function () {
		model.additionalPhones(model.additionalPhones().filter(function (item) {
			return item.phone() && item.phone().length > 0 && item.phone.isValid();
		}));
	};

	model.removeEmptyPortfolio = function () {
		model.portfolio(model.nonEmptyPortfolio());
	};

	model.removeEmptySocialNetworks = function () {
		model.socialNetworks(model.nonEmptySocialNetworks());
	};

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

	model.socialNetworksActiveClass = 'socialnetwork socialnetwork-active ';
	model.socialNetworksDefaultClass = 'socialnetwork';

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
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		mapper.fromJS(model, data);

		model.additionalPhones(data.additionalPhones.map(function (item) {
			return new ResumeContactsAdditionalPhoneModel(model, item);
		}));

		model.portfolio(data.portfolio.map(function (item) {
			return new ResumeContactsPortfolioModel(model, item);
		}));

		model.socialNetworks(data.socialNetworks.map(function (item) {
			return new ResumeContactsSocialNetworkModel(model, item);
		}));
	};

	model.get = function () {
		backend.get(parent.api + '/resume/' + parent.resumeId + '/contact').success(function (data) {
			model.fromJS(data);

			if (model.portfolio().length === 0) {
				model.portfolio.push(new ResumeContactsPortfolioModel(model));
			}
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			model.removeBadOrEmptyAdditionalPhones();
			model.removeEmptyPortfolio();
			model.removeEmptySocialNetworks();
			backend.post(parent.api + '/resume/' + parent.resumeId + '/contact', model.toJS())
				.success(function () {
					model.commit();
					model.additionalPhones().forEach(function (item) {
						item.commit();
					});
					model.portfolio().forEach(function (item) {
						item.commit();
					});
					model.successMessage(model.resource.successSave.label());
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
					}
				});
		} else {
			model.errors.showAllMessages(true);
		}
	};

	model.edit = function () {
		model.beginEdit();
		model.additionalPhones().forEach(function (item) {
			item.beginEdit();
		});
		model.portfolio().forEach(function (item) {
			item.beginEdit();
		});
	};

	model.cancel = function () {
		model.rollback();
		model.additionalPhones().forEach(function (item) {
			item.rollback();
		});
		model.portfolio().forEach(function (item) {
			item.rollback();
		});
	};

	model.addAdditionalPhone = function () {
		model.additionalPhones.push(new ResumeContactsAdditionalPhoneModel(model));
		model.edit();
	};

	model.addPortfolio = function () {
		model.portfolio.push(new ResumeContactsPortfolioModel(model));
		model.edit();
	};

	model.isAddPortfolioButtonVisible = ko.computed(function () {
		return model.portfolio().filter(function (item) {
			return item.portfolio() && item.portfolio().length > 0;
		}).length > 0;
	});

	InitEditableModel(model, 'contacts');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);
}

function ResumeContactsAdditionalPhoneModel (parent, data) {
	var model = this;

	model.phone = ko.observable(data).extend({
		pattern: {
			params: '^[0-9\\-\\+\\(\\)\\ ]+.$',
			message: function (params, observable) {
				return model.resource.wrongFormat.label();
			}
		}
	});
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
	};

	InitEditableModel(model, 'phone');
}

function ResumeContactsPortfolioModel (parent, data) {
	var model = this;

	model.resource = parent.resource;
	model.portfolio = ko.observable(data);

	model.isRemoveButtonVisible = ko.computed(function () {
		return parent.portfolio.indexOf(model) > 0;
	});

	model.formRowLabel = ko.computed(function () {
		return parent.portfolio.indexOf(model) > 0 ? '' : model.resource.contactsPortfolioLabel.label();
	});

	model.isLink = ko.computed(function () {
		return model.portfolio() && (model.portfolio().indexOf('http://') === 0 || model.portfolio().indexOf('https://') === 0);
	});

	model.toJS = function () {
		return model.portfolio();
	};

	model.fromJS = function (data) {
		if (!data) return;

		model.portfolio(data);
	};

	model.remove = function (item) {
		parent.portfolio.remove(item);
	};

	InitEditableModel(model, 'portfolio');
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

	model.subTypeIcon = ko.computed(function () {
		if (model.subTypeAsString() === '1') return '<i class="fa fa-linkedin"></i>';
		else if (model.subTypeAsString() === '2') return '<i class="fa fa-facebook"></i>';
		else if (model.subTypeAsString() === '3') return '<i class="fa fa-vk"></i>';
		else if (model.subTypeAsString() === '4') return '<i class="fa fa-twitter"></i>';
		else if (model.subTypeAsString() === '5') return '<i class="fa fa-google-plus"></i>';
		else if (model.subTypeAsString() === '6') return '<i class="fa fa-odnoklassniki"></i>';
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
