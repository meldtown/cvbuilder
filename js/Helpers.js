ko.bindingHandlers.tinylight = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var property = valueAccessor();
		jQuery(element).tinylight({height: 200, updateOnKeyUp: true});
		jQuery(element).on('change', function () {
			property(jQuery(element).val());
		});
	},
	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		// This will be called once when the binding is first applied to an element,
		// and again whenever any observables/computeds that are accessed change
		// Update the DOM element based on the supplied values here.
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
