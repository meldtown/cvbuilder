ko.components.register('yearmonth-widget', {
	viewModel: function (params) {
		var model = this;

		model._initialized = false;
		model._lng = params._lng;
		model.showTillNowOption = params.showTillNowOption;
		model.resource = params.resource;
		model.value = params.value;
		model.validationElement = params.validationElement;

		model.updateValue = function () {
			if (!model._initialized) return;

			var month = model.selectedMonthOption() ? model.selectedMonthOption().id : null;
			var year = model.selectedYearOption();
			if (month && year) {
				if (model.showTillNowOption && month === -1) {
					model.value(undefined);
				} else {
					model.value(moment(new Date(year, month, 1)).format());
				}
			} else {
				model.value(undefined);
			}
		};

		// months (jan..dec)
		model.monthOptions = [];

		if (model.showTillNowOption) {
			model.monthOptions.push({'id': -1, 'ru': 'настоящее время', 'ua': 'теперішній час', 'en': 'present time'});
		}

		model.monthOptions.push({'id': 0, 'ru': 'январь', 'ua': 'січень', 'en': 'january'});
		model.monthOptions.push({'id': 1, 'ru': 'февраль', 'ua': 'лютий', 'en': 'february'});
		model.monthOptions.push({'id': 2, 'ru': 'март', 'ua': 'березень', 'en': 'march'});
		model.monthOptions.push({'id': 3, 'ru': 'апрель', 'ua': 'квітень', 'en': 'april'});
		model.monthOptions.push({'id': 4, 'ru': 'май', 'ua': 'травень', 'en': 'may'});
		model.monthOptions.push({'id': 5, 'ru': 'июнь', 'ua': 'червень', 'en': 'june'});
		model.monthOptions.push({'id': 6, 'ru': 'июль', 'ua': 'липень', 'en': 'july'});
		model.monthOptions.push({'id': 7, 'ru': 'август', 'ua': 'серпень', 'en': 'august'});
		model.monthOptions.push({'id': 8, 'ru': 'сентябрь', 'ua': 'вересень', 'en': 'september'});
		model.monthOptions.push({'id': 9, 'ru': 'октябрь', 'ua': 'жовтень', 'en': 'october'});
		model.monthOptions.push({'id': 10, 'ru': 'ноябрь', 'ua': 'листопад', 'en': 'november'});
		model.monthOptions.push({'id': 11, 'ru': 'декабрь', 'ua': 'грудень', 'en': 'december'});

		model.monthOptions = model.monthOptions.map(function (item) {
			return new DictionaryModel(model, item);
		});

		model.selectedMonthOption = ko.observable();
		model.selectedMonthOption.subscribe(function (newValue) {
			if (newValue.id === -1 && model.showTillNowOption) {
				model.selectedYearOption((new Date()).getFullYear());
			}
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
		model.isYearEnabled = ko.computed(function () {
			if (model.showTillNowOption) {
				return model.selectedMonthOption() && model.selectedMonthOption().id !== -1;
			}

			return true;
		});

		// if there is initial value - set dropdown values
		if (model.value()) {
			if (model.showTillNowOption && model.value() === '1900-01-01T00:00:00') {
				model.selectedMonthOption(model.monthOptions[0]);
				model.selectedYearOption((new Date()).getFullYear());
			} else {
				model.selectedMonthOption(model.monthOptions[moment(model.value()).month()]);
				model.selectedYearOption(moment(model.value()).year());
			}
			model._initialized = true; // without that updateValue will be called few times and wrong date will be set
		}
	},
	template: document.getElementById('yearmonth-widget').innerHTML
});
