ko.bindingHandlers.element = {
	init: function (element, valueAccessor) {
		var target = valueAccessor();

		target(element);
	}
};

ko.bindingHandlers.label = {
	handle: function (element, valueAccessor) {
		var property = valueAccessor();

		if (property && property.label && ko.isObservable(property.label)) {
			element.innerHTML = property.label();
		} else {
			console.error('RESX', element, valueAccessor);
			element.innerHTML = 'NOT FOUND'; // TODO: before production make empty string here
		}
	},
	init: function (element, valueAccessor) {
		ko.bindingHandlers.label.handle(element, valueAccessor);
	},
	update: function (element, valueAccessor) {
		ko.bindingHandlers.label.handle(element, valueAccessor);
	}
};

ko.bindingHandlers.tinylight = {
	init: function (element, valueAccessor) {
		var property = valueAccessor();

		jQuery(element).tinylight({
			height: 200, updateOnKeyUp: function (html, tiny) {
				property(jQuery(html).text().trim().length > 0 ? html : undefined);
				if (property.isValid()) {
					tiny.holder.removeClass('validationElement');
				} else {
					tiny.holder.addClass('validationElement');
				}
			}
		});

		if (property()) {
			jQuery(element).tinylight('setHtml', property());
		}
		property.isModified(false);
	}
};

ko.bindingHandlers.autocompleteKeyword = {
	init: function (element, valueAccessor, allBindings, viewModel) {
		var property = valueAccessor();

		if (element.nodeName.toLowerCase() !== 'input') {
			console.log('autocompleteKeyword skip non input', element, valueAccessor);
			return;
		}
		if (element.getAttribute('type') !== 'text') {
			console.log('autocompleteKeyword skip non text input', element, valueAccessor);
			return;
		}
		if (!viewModel || !viewModel._keywordsApiUrl || !ko.isObservable(viewModel._keywordsApiUrl)) {
			console.log('autocompleteKeyword skip model without keywords api url', element, valueAccessor);
			return;
		}
		if (!viewModel || !viewModel._lng || !ko.isObservable(viewModel._lng)) {
			console.log('autocompleteKeyword skip model without lng', element, valueAccessor);
			return;
		}

		jQuery(element).autocomplete({
			source: function (request, response) {
				var lng = viewModel._lng();

				jQuery.getJSON(viewModel._keywordsApiUrl(), {
					term: request.term,
					language: lng.enum
				}, response);
			},
			minLength: 2,
			select: function (event, ui) {
				property(ui.item.value);
			}
		});
	}
};

ko.bindingHandlers.autocompleteCompany = {
	init: function (element, valueAccessor, allBindings, viewModel) {
		var property = valueAccessor();

		if (element.nodeName.toLowerCase() !== 'input') {
			console.log('autocompleteCompany skip non input', element, valueAccessor);
			return;
		}
		if (element.getAttribute('type') !== 'text') {
			console.log('autocompleteCompany skip non text input', element, valueAccessor);
			return;
		}
		if (!viewModel || !viewModel._companyApiUrl || !ko.isObservable(viewModel._companyApiUrl)) {
			console.log('autocompleteCompany skip model without _companyApiUrl', element, valueAccessor);
			return;
		}
		if (!viewModel || !viewModel._lng || !ko.isObservable(viewModel._lng)) {
			console.log('autocompleteCompany skip model without _lng', element, valueAccessor);
			return;
		}

		if (!viewModel || !viewModel._branch) {
			console.log('autocompleteCompany skip model without _branch', element, valueAccessor);
			return;
		}

		jQuery(element).autocomplete({
			source: viewModel._companyApiUrl(),
			minLength: 2,
			select: function (event, ui) {
				property(ui.item.companyName);

				if (ko.isObservable(viewModel.selectedBranchOption)) {
					viewModel.selectedBranchOption({id: ui.item.branchId});
				}

				if (ko.isObservable(viewModel.notebookCompanyId)) {
					viewModel.notebookCompanyId(ui.item.notebookId);
				}

				if (ko.isObservable(viewModel.companySite)) {
					viewModel.companySite(ui.item.companySite);
				}

				if (ko.isObservable(viewModel.employeesAmount)) {
					viewModel.employeesAmount(ui.item.employeeCountId);
				}

				return false;
			},
			change: function (event, ui) {
				if (!ui.item) {
					if (ko.isObservable(viewModel.notebookCompanyId)) {
						viewModel.notebookCompanyId(undefined);
					}

					if (ko.isObservable(viewModel.companySite)) {
						viewModel.companySite(undefined);
					}

					if (ko.isObservable(viewModel.employeesAmount)) {
						viewModel.employeesAmount(undefined);
					}
				}
			}
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			var img = $('<span>').css('background-image', 'url("http://img1.rabota.com.ua/Data/cImg/' + item.logo + '")');

			var label = $('<span>').append([
				$('<span>').text(item.companyName),
				$('<small>').text(item.branchName)
			]);

			var a = $('<a>').addClass('autocomplete-company').append([img, label]);

			return $('<li>').append(a).appendTo(ul);
		};
	}
};

ko.bindingHandlers.autocompleteCompanies = {
	init: function (element, valueAccessor) {
		var property = valueAccessor();
		var value = property.value;
		var api = ko.unwrap(property.api);

		jQuery(element).autocomplete({
			source: api + '/autocomplete/company',
			minLength: 2,
			select: function (event, ui) {
				var alreadySelected = ko.unwrap(value).some(function (item) {
					return item.notebookId === ui.item.notebookId;
				});

				if (!alreadySelected) {
					value.push(ui.item);
				}

				jQuery(element).val('');
				return false;
			},
			change: function (event, ui) {
				if (!ui.item) {
					jQuery(element).val('');
				}
			}
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			var img = $('<span>').css('background-image', 'url("http://img1.rabota.com.ua/Data/cImg/' + item.logo + '")');

			var label = $('<span>').append([
				$('<span>').text(item.companyName),
				$('<small>').text(item.branchName)
			]);

			var a = $('<a>').addClass('autocomplete-company').append([img, label]);

			return $('<li>').append(a).appendTo(ul);
		};
	}
};

ko.bindingHandlers.autocompleteBranches = {
	init: function (element, valueAccessor) {
		var property = valueAccessor();
		var options = property.options;
		var value = property.value;

		jQuery(element).autocomplete({
			source: function (request, response) {
				var term = (request.term || '').toLowerCase();

				var alreadySelectedIds = ko.unwrap(value).map(function (item) {
					return item.id;
				});

				var optionsExceptAlreadySelectedIds = ko.unwrap(options).filter(function (item) {
					return alreadySelectedIds.indexOf(item.id) === -1;
				});

				if (term) {
					var filteredOptions = optionsExceptAlreadySelectedIds.filter(function (item) {
						return ko.unwrap(item.label).toLowerCase().indexOf(term) === 0;
					});
					response(filteredOptions);
				} else {
					response(optionsExceptAlreadySelectedIds);
				}
			},
			minLength: 0,
			select: function (event, ui) {
				var alreadySelected = ko.unwrap(value).some(function (item) {
					return item.id === ui.item.id;
				});

				if (!alreadySelected) {
					value.push(ui.item);
				}

				jQuery(element).val('');
				return false;
			},
			change: function (event, ui) {
				if (!ui.item) {
					jQuery(element).val('');
				}
			}
		}).on('click', function () {
			$(this).select();
			$(this).autocomplete('search', '');
		}).on('focus', function () {
			$(this).autocomplete('search', '');
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			return $('<li>').append($('<a>').text(ko.unwrap(item.label))).appendTo(ul);
		};
	}
};

ko.bindingHandlers.autocompleteCityId = {
	findById: function (options, value) {
		var str = (ko.unwrap(value) || '').toString();
		return ko.unwrap(options)
				.filter(function (item) {
					return item.id.toString() === str;
				})
				.map(function (item) {
					return item.label();
				})
				.shift() || '';
	},
	init: function (element, valueAccessor) {
		var params = valueAccessor();
		var value = params.value;
		var options = params.options;

		jQuery(element).val(ko.bindingHandlers.autocompleteCityId.findById(options, value));

		jQuery(element).autocomplete({
			source: function (request, response) {
				var term = (request.term || '').toLowerCase().trim();

				if (!term) {
					response(ko.unwrap(options).slice(0, 10));
				} else {
					response(ko.unwrap(options).filter(function (item) {
						return item.label().toLowerCase().indexOf(term) === 0;
					}));
				}
			},
			minLength: 0,
			select: function (event, ui) {
				event.preventDefault();
				params.value(ui.item.id);
			},
			change: function (event, ui) {
				if (!ui.item) {
					params.value(undefined);
					jQuery(element).val('');
				}
			}
		}).on('click', function () {
			$(this).select(); // on click select all text in input (e.g. ctrl+a)
		}).on('focus', function () {
			$(this).autocomplete('search', ''); // on focus run search
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			return $('<li>').append('<a>' + item.label() + '</a>').appendTo(ul);
		};
	},
	update: function (element, valueAccessor) {
		var params = valueAccessor();
		jQuery(element).val(ko.bindingHandlers.autocompleteCityId.findById(params.options, params.value));
	}
};

ko.bindingHandlers.autocompleteCity = {
	init: function (element, valueAccessor) {
		var params = valueAccessor();
		var value = params.value;
		var options = params.options;
		jQuery(element).val(ko.unwrap(value));

		jQuery(element).autocomplete({
			source: function (request, response) {
				var term = (request.term || '').toLowerCase().trim();

				if (!term) {
					response(ko.unwrap(options).slice(0, 10));
				} else {
					response(ko.unwrap(options).filter(function (item) {
						return item.label().toLowerCase().indexOf(term) === 0;
					}));
				}
			},
			minLength: 0,
			select: function (event, ui) {
				event.preventDefault();
				params.value(ui.item.label());
			}
		}).on('click', function () {
			$(this).select();
		}).on('focus', function () {
			$(this).autocomplete('search', '');
		}).on('input', function () {
			params.value($(this).val());
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			return $('<li>').append('<a>' + item.label() + '</a>').appendTo(ul);
		};
	},
	update: function (element, valueAccessor) {
		var params = valueAccessor();
		jQuery(element).val(ko.unwrap(params.value));
	}
};

ko.validation.init({
	decorateInputElement: true
}, true);

function InitEditableModel (model, templatePrefix) {
	ko.editable(model);
	model.errors = ko.validation.group(model);
	model.tpl = ko.computed(function () {
		return model.inTransaction() ? templatePrefix + '-form' : templatePrefix + '-view';
	});
}

function InitBadRequestResponseHandler (model) {
	model.handleBarRequestResponse = function (jqXHR) {
		if (jqXHR.status === 400) {
			var data = JSON.parse(jqXHR.responseText);

			if (data.hasOwnProperty('modelState')) {
				Object.keys(data.modelState).forEach(function (key) {
					var modelKey = key.replace('data.', '');
					modelKey = modelKey.substr(0, 1).toLowerCase() + modelKey.substr(1);

					if (model.hasOwnProperty(modelKey) && typeof model[modelKey].setError === 'function') {
						model[modelKey].setError(data.modelState[key]);
					}
				});
				model.errors.showAllMessages(true);
			}
		}
	};
}

function InitResultMessage (model) {
	model._successMessageClass = 'alert-message alert-message-success';
	model._errorMessageClass = 'alert-message alert-message-danger';
	model.message = ko.observable();
	model.messageClass = ko.observable(model._successMessageClass);

	model.computedMessageClass = ko.computed(function () {
		return model.message()
			? model.messageClass() + ' active'
			: model.messageClass() + ' hidden';
	});

	model.successMessage = ko.computed({
		read: function () {
			return model.message();
		},
		write: function (newValue) {
			model.message(newValue);
			if (newValue) {
				model.messageClass(model._successMessageClass);
			} else {
				model.messageClass(model._successMessageClass);
			}
		}
	});

	model.errorMessage = ko.computed({
		read: function () {
			return model.message();
		},
		write: function (newValue) {
			model.message(newValue);
			if (newValue) {
				model.messageClass(model._errorMessageClass);
			} else {
				model.messageClass(model._errorMessageClass);
			}
		}
	});

	model.closeMessage = function () {
		model.message(undefined);
		model.messageClass(model._successMessageClass);
	};

	model.messageTimer = null;
	model.message.subscribe(function () {
		if (model.messageTimer) {
			clearTimeout(model.messageTimer);
		}

		model.messageTimer = setTimeout(function () {
			model.closeMessage();
		}, 3000);
	});
}

var utils = {
	required: function (messageDictionaryModel) {
		return {
			params: true,
			message: function (params, observable) {
				return messageDictionaryModel.label();
			}
		};
	},
	requiredOnly: function (messageDictionaryModel) {
		return {
			required: utils.required(messageDictionaryModel)
		};
	}
};

var mapper = {
	isArrayObservable: function (item) {
		return ko.isObservable(item) && typeof item.push === 'function';
	},
	isSimpleType: function (item) {
		var data = ko.isObservable(item) ? item() : item;
		// TODO: catch DateTime
		return ['number', 'string', 'boolean'].indexOf(typeof data) !== -1;
	},
	isPluginKey: function (key) {
		if (key[0] === '_') return true;
		return ['hasChanges', 'inTransaction', 'tpl', 'api'].indexOf(key) !== -1;
	},
	toJS: function (model) {
		var keys = Object.keys(model).filter(function (key) {
			return !mapper.isPluginKey(key) && !ko.isComputed(model[key]);
		});

		var result = {};

		// Simple types
		keys.filter(function (key) {
			return !mapper.isArrayObservable(model[key]) && mapper.isSimpleType(model[key]);
		}).forEach(function (key) {
			result[key] = ko.isObservable(model[key]) ? model[key]() : model[key];
		});

		// Observable arrays
		keys.filter(function (key) {
			return mapper.isArrayObservable(model[key]);
		}).forEach(function (key) {
			if (model[key]().length > 0 && typeof model[key]()[0].toJS === 'function') {
				result[key] = model[key]().map(function (item) {
					return item.toJS();
				});
			} else {
				result[key] = model[key]();
			}
		});

		return result;
	},
	fromJS: function (model, data) {
		Object.keys(data).filter(function (key) {
			return model.hasOwnProperty(key) && !mapper.isPluginKey(key) && !mapper.isArrayObservable(model[key]) && (mapper.isSimpleType(model[key]) || mapper.isSimpleType(data[key]));
		}).forEach(function (key) {
			if (ko.isObservable(model[key])) {
				model[key](data[key]);
			} else {
				model[key] = data[key];
			}
		});
	}
};

var backend = {
	request: function (type, url, data) {
		var options = {
			type: type,
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		};

		if (data) {
			if (type === 'GET') {
				options.url = options.url + (options.url.indexOf('?') === -1 ? '&' : '?') + jQuery.param(data);
			} else {
				options.data = JSON.stringify(ko.toJS(data));
			}
		}

		return $.ajax(options);
	},
	post: function (url, data) {
		return backend.request('POST', url, data);
	},
	get: function (url, data) {
		return backend.request('GET', url, data);
	},
	remove: function (url) {
		return backend.request('DELETE', url);
	}
};
