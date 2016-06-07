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
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var property = valueAccessor();
		element.value = property();
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
	}
};

ko.bindingHandlers.autocompleteKeyword = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var property = valueAccessor();

		if (element.nodeName.toLowerCase() !== 'input') return;
		if (element.getAttribute('type') !== 'text') return;
		if (!viewModel || !viewModel._keywordsApiUrl || !ko.isObservable(viewModel._keywordsApiUrl)) return;
		if (!viewModel || !viewModel._lng || !ko.isObservable(viewModel._lng)) return;

		jQuery(element).autocomplete({
			source: function (request, response) {
				var lng = viewModel._lng();

				if (lng === 'ru') lng = 'russian';
				else if (lng === 'ua') lng = 'ukrainian';
				else if (lng === 'en') lng = 'english';

				jQuery.getJSON(viewModel._keywordsApiUrl(), {
					term: request.term,
					language: lng
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
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var property = valueAccessor();

		if (element.nodeName.toLowerCase() !== 'input') return;
		if (element.getAttribute('type') !== 'text') return;
		if (!viewModel || !viewModel._companyApiUrl || !ko.isObservable(viewModel._companyApiUrl)) return;
		if (!viewModel || !viewModel._lng || !ko.isObservable(viewModel._lng)) return;
		if (!viewModel || !viewModel._branch) return;

		jQuery(element).autocomplete({
			source: viewModel._companyApiUrl(),
			minLength: 2,
			select: function (event, ui) {
				property(ui.item.companyName);
				return false;
			}
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			var imageSource = 'http://img1.rabota.com.ua/Data/cImg/' + item.logo;
			var branchName = viewModel._branch.findById(item.branchId);


			var containerRight = document.createElement('DIV');
			containerRight.setAttribute('class', 'company-autocomplete-right');
			var img = document.createElement('IMG');
			img.src = imageSource;
			img.setAttribute('class', 'company-logo-autocomplete');
			$(containerRight).append('<span class="autocomplete-company-name">' + item.companyName + '</span><br><span class="autocomplete-company-branch">' + branchName.label() + '</span>');

			var a = document.createElement('A');
			var containerLeft = document.createElement('DIV');
			containerLeft.setAttribute('class', 'company-autocomplete-left');
			$(containerLeft).append(img);
			$(a).append(containerLeft);
			$(a).append(containerRight);
			return $('<li>').append(a).appendTo(ul);
		};
	}
};

ko.bindingHandlers.autocompleteCity = {
	findById: function (options, value) {
		var str = (ko.unwrap(value) || '').toString();
		return ko.unwrap(options).filter(function (item) {
			return item.id.toString() === str;
		}).map(function (item) {
			return item.label();
		}).shift() || '';
	},
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var params = valueAccessor();
		var value = params.value;
		var options = params.options;

		jQuery(element).val(ko.bindingHandlers.autocompleteCity.findById(options, value));

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
		jQuery(element).val(ko.bindingHandlers.autocompleteCity.findById(params.options, params.value));
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

function InitBadRequestResponseHandler(model) {
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
