ko.components.register('yearmonth-widget', {
	viewModel: function (params) {
		var model = this;

		model._initialized = false;
		model._lng = params._lng;
		model.value = params.value;
		model.validationElement = params.validationElement;

		model.updateValue = function () {
			if (!model._initialized) return;
			var month = model.selectedMonthOption() ? model.selectedMonthOption().id : null;
			var year = model.selectedYearOption();
			if (month && year) {
				model.value(moment(new Date(year, month, 1)).format());
			} else {
				model.value(undefined);
			}
		};

		// months (jan..dec)
		model.monthOptions = [
			{'id': 0, 'ru': 'январь', 'ua': 'січень', 'en': 'january'},
			{'id': 1, 'ru': 'февраль', 'ua': 'лютий', 'en': 'february'},
			{'id': 2, 'ru': 'март', 'ua': 'березень', 'en': 'march'},
			{'id': 3, 'ru': 'апрель', 'ua': 'квітень', 'en': 'april'},
			{'id': 4, 'ru': 'май', 'ua': 'травень', 'en': 'may'},
			{'id': 5, 'ru': 'июнь', 'ua': 'червень', 'en': 'june'},
			{'id': 6, 'ru': 'июль', 'ua': 'липень', 'en': 'july'},
			{'id': 7, 'ru': 'август', 'ua': 'серпень', 'en': 'august'},
			{'id': 8, 'ru': 'сентябрь', 'ua': 'вересень', 'en': 'september'},
			{'id': 9, 'ru': 'октябрь', 'ua': 'жовтень', 'en': 'october'},
			{'id': 10, 'ru': 'ноябрь', 'ua': 'листопад', 'en': 'november'},
			{'id': 11, 'ru': 'декабрь', 'ua': 'грудень', 'en': 'december'}
		].map(function (item) {
			return new DictionaryModel(model, item);
		});
		model.selectedMonthOption = ko.observable();
		model.selectedMonthOption.subscribe(function (newValue) {
			model.updateValue();
		});

		// years (1930..2016)
		model.yearOptions = [];
		for (var year = (new Date()).getFullYear(); year >= (new Date()).getFullYear() - 80; year--) {
			model.yearOptions.push(year);
		}
		model.selectedYearOption = ko.observable();
		model.selectedYearOption.subscribe(function (newValue) {
			model.updateValue();
		});

		// if there is initial value - set dropdown values
		if (model.value()) {
			model.selectedMonthOption(model.monthOptions[moment(model.value()).month()]);
			model.selectedYearOption(moment(model.value()).year());
			model._initialized = true; // without that updateValue will be called few times and wrong date will be set
		}
	},
	template: document.getElementById('yearmonth-widget').innerHTML
});
