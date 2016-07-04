function ResumePersonalModel (parent, data, photo) {
	var model = this;

	model._lng = ko.computed(function () {
		return parent._lng();
	});

	model.api = ko.computed(function () {
		return parent.api();
	});
	model.resource = parent.dictionary.resource;
	model.resumeId = parent.resumeId;

	model.name = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.displayedName = ko.computed(function () {
		return parent.state.anonymous() ? model.resource.anonimousNameFirst.label() : model.name();
	});
	model.middleName = ko.observable();
	model.surName = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.displayedSurName = ko.computed(function () {
		return parent.state.anonymous() ? model.resource.anonimousNameSecond.label() : model.surName();
	});
	model.dateBirth = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.sex = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.cityId = ko.observable().extend(utils.requiredOnly(model.resource.requiredMessage));
	model.moving = ko.observableArray();

	model._defaultPhoto = 'http://img1.rabota.com.ua/static/2013/11/img/nophoto.png';
	model._photo = ko.observable(model._defaultPhoto);
	model._photoCroppie = null;
	model._photoDialog = ko.observable();
	model.isPhotoAdded = ko.computed(function () {
		return model._photo().indexOf('nophoto.png') === -1;
	});
	model.addOrChangePhotoButtonLabel = ko.computed(function () {
		return model.isPhotoAdded()
			? model.resource.changePhoto.label()
			: model.resource.addPhoto.label();
	});

	model.dataURItoBlob = function (dataURI) {
		var byteString;
		if (dataURI.split(',').shift().indexOf('base64') >= 0) {
			byteString = atob(dataURI.split(',').pop());
		} else {
			byteString = unescape(dataURI.split(',').pop());
		}

		var mimeString = dataURI.split(',').shift().split(':').pop().split(';').shift();

		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type: mimeString});
	};

	model.onPhotoChange = function (instance, event) {
		if (!model._photoDialog()) return;

		if (!model._photoCroppie) {
			model._photoCroppie = $(model._photoDialog()).find('.croppie-container').croppie({
				viewport: {
					width: 112,
					height: 150
				},
				boundary: {
					width: 300,
					height: 300
				}
			});
		}

		if (event.target.files && event.target.files[0] && event.target.files[0].type.match('image.*')) {
			var reader = new FileReader();

			reader.onload = function (event) {
				$(model._photoDialog()).dialog({
					autoOpen: true,
					width: 400,
					open: function () {
						model._photoCroppie.croppie('bind', {
							url: event.target.result
						});
					}
				});
			};

			reader.readAsDataURL(event.target.files[0]);
		} else {
			alert('Only images allowed');
		}
	};
	model.onPhotoSubmit = function () {
		model._photoCroppie.croppie('result', {
			type: 'canvas',
			size: 'viewport'
		}).then(function (respponse) {
			var formData = new FormData();
			var xhr = new XMLHttpRequest();

			formData.append('blob', model.dataURItoBlob(respponse));

			xhr.open('POST', parent.api() + '/resume/' + parent.resumeId + '/photo', true);
			xhr.onload = function () {
				if (xhr.status === 200) {
					model._photo(JSON.parse(this.response));
					jQuery(model._photoDialog()).dialog('close');
				} else {
					console.log('ERROR', xhr);
					model.getPhoto();
				}
			};
			xhr.onerror = function () {
				console.log('ERROR', xhr);
				model.getPhoto();
			};
			xhr.withCredentials = true;
			xhr.send(formData);
		});
	};

	model.onPhotoCancel = function () {
		if (!model._photoDialog()) return;
		jQuery(model._photoDialog()).dialog('close');
	};

	model.cityOptions = parent.dictionary.city;
	model.city = ko.computed(function () {
		var data = model.cityOptions.findById(model.cityId());
		return data ? data.label() : '';
	});
	model.cityId.subscribe(function (newValue) {
		model.moving.remove(function (item) {
			return item.cityId() === newValue;
		});
	});

	model.isMovingAble = ko.computed(function () {
		return !!model.moving().length;
	});

	model.sexOptions = parent.dictionary.sex;
	model.selectedSexOption = ko.computed({
		read: function () {
			return model.sexOptions.findById(model.sex());
		},
		write: function (newValue) {
			model.sex(newValue ? newValue.id : undefined);
		}
	}).extend({
		validation: {
			validator: function (val) {
				if (model.sex() === 0 || model.sex() === 1) {
					return true;
				} else return false;
			},
			message: function (params, observable) {
				return model.resource.requiredMessage.label();
			}
		}
	});
	model.selectedSexOptionLabel = ko.computed(function () {
		var label = parent.dictionary.sex.findById(model.sex());
		label = label ? label.label() : '';

		return model._lng().dictionary === 'en'
			? label
			: label + ' ' + model.resource.personalSexLabel.label().toLocaleLowerCase();
	});

	// model.dateBirthFormatted = ko.computed(function () {
	// 	moment.locale(model._lng() === 'ua' ? 'uk' : model._lng());
	// 	return moment(model.dateBirth()).format('LL');
	// });
	model.age = ko.computed(function () {
		moment.locale(model._lng().moment);
		return moment.duration(moment() - moment(model.dateBirth())).humanize();
	});

	model.movingLabels = ko.computed(function () {
		return model.moving().map(function (item) {
			return item.label();
		}).join(', ');
	});

	model.removeEmptyMoving = function () {
		model.moving(model.moving().filter(function (item) {
			return item.cityId();
		}));
	};

	model.toJS = function () {
		return mapper.toJS(model);
	};

	model.fromJS = function (data) {
		if (!data) return;

		mapper.fromJS(model, data);

		model.moving(data.moving.map(function (item) {
			return new ResumePersonalMovingModel(model, item);
		}));
	};

	model.get = function () {
		backend.get(parent.api() + '/resume/' + parent.resumeId + '/personal').success(function (data) {
			model.fromJS(data);
		});
		model.getPhoto();
	};

	model.getPhoto = function () {
		backend.get(parent.api() + '/resume/' + parent.resumeId + '/photo').success(function (data) {
			model._photo(data);
		});
	};

	model.save = function () {
		if (model.errors().length === 0) {
			model.removeEmptyMoving();

			backend.post(parent.api() + '/resume/' + parent.resumeId + '/personal', model.toJS())
				.success(function () {
					model.commit();
					model.successMessage(model.resource.successSave.label());
				})
				.fail(function (jqXHR) {
					if (jqXHR.status === 400) {
						model.handleBarRequestResponse(jqXHR);
						model.errorMessage('ERROR');
					} else {
						model.errorMessage('ERROR');
					}
				});
		} else {
			model.errors.showAllMessages(true);
		}
	};

	model.edit = function () {
		model.beginEdit();
	};

	model.cancel = function () {
		model.rollback();
	};

	model.addMoving = function () {
		model.moving.push(new ResumePersonalMovingModel(model));
	};

	InitEditableModel(model, 'personal');
	InitBadRequestResponseHandler(model);
	InitResultMessage(model);

	if (data) model.fromJS(data);
}

function ResumePersonalMovingModel (parent, data) {
	var model = this;

	model.cityId = ko.observable(data);
	model.resource = parent.resource;

	model.toJS = function () {
		return model.cityId();
	};

	model.fromJS = function (data) {
		if (!data) return;

		model.cityId(data);
	};

	model.cityOptions = ko.computed(function () {
		var otherMovings = parent.moving().map(function (item) {
			return item.cityId();
		}).filter(function (cityId) {
			return cityId && cityId !== model.cityId();
		});

		return parent.cityOptions.filter(function (item) {
			return item.id !== parent.cityId() && otherMovings.indexOf(item.id) === -1;
		});
	});

	model.label = ko.computed(function () {
		var data = parent.cityOptions.findById(model.cityId());
		return data ? data.label() : '';
	});

	model.remove = function (item) {
		parent.moving.remove(item);
	};

	if (data) {
		model.fromJS(data);
	}

	if (photo) {
		model._photo(photo);
	}
}
