ko.bindingHandlers.element = {
	init: function (element, valueAccessor) {
		var target = valueAccessor();

		target(element);
	}
};

ko.components.register('photo-widget', {
	viewModel: function (params) {
		var model = this;

		model.dialog = ko.observable();
		model.croppie = null;

		model.api = params.api + '/resume/' + params.resumeId + '/photo';
		model.resumeId = params.resumeId;
		model.resource = params.resource;

		model.defaultPhoto = 'http://img1.rabota.com.ua/static/2013/11/img/nophoto.png';
		model.value = ko.observable(model.defaultPhoto);

		model.isPhotoAdded = ko.computed(function () {
			return model.value().indexOf('nophoto.png') === -1;
		});
		model.addOrChangePhotoButtonLabel = ko.computed(function () {
			return model.isPhotoAdded()
				? model.resource.changePhoto.label()
				: model.resource.addPhoto.label();
		});

		model.get = function () {
			backend.get(model.api).success(function (data) {
				model.value(data);
			}).fail(function (jqXHR) {
				console.log('get photo fail', jqXHR);
				model.value(model.defaultPhoto);
			});
		};

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

		model.change = function (instance, event) {
			if (!model.dialog()) return;

			if (!model.croppie) {
				model.croppie = $(model.dialog()).find('.croppie-container').croppie({
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
					$(model.dialog()).dialog({
						autoOpen: true,
						width: 400,
						open: function () {
							model.croppie.croppie('bind', {
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

		model.submit = function () {
			model.croppie.croppie('result', {
				type: 'canvas',
				size: 'viewport'
			}).then(function (respponse) {
				var formData = new FormData();
				var xhr = new XMLHttpRequest();

				formData.append('blob', model.dataURItoBlob(respponse));

				xhr.open('POST', model.api, true);
				xhr.onload = function () {
					if (xhr.status === 200) {
						model.value(JSON.parse(this.response));
						jQuery(model.dialog()).dialog('close');
					} else {
						console.log('ERROR', xhr);
						model.get();
					}
				};
				xhr.onerror = function () {
					console.log('ERROR', xhr);
					model.get();
				};
				xhr.withCredentials = true;
				xhr.send(formData);
			});
		};

		model.cancel = function () {
			if (!model.dialog()) return;
			jQuery(model.dialog()).dialog('close');
		};

		model.get();
	},
	template: '<p>\n\t<img id="photo" src="http://img1.rabota.com.ua/static/2013/11/img/nophoto.png" width="112" height="150" alt="photo" data-bind="attr: { src: value }"/>\n</p>\n<span class="btn btn-danger btn-file">\n\t<span data-bind="text: addOrChangePhotoButtonLabel"></span>\n\t<input type="file" accept="image/*" data-bind="event: { change: change }" />\n</span>\n\n<div class="croppie-dialog" style="display: none" data-bind="element: dialog">\n\t<div class="croppie-container"></div>\n\t<div class="actions">\n\t\t<a href="#" class="btn btn-primary" data-bind="label: resource.save, click: submit"></a>\n\t\t<a href="#" class="btn btn-link rua-p-c-light" data-bind="label: resource.discard, click: cancel"></a>\n\t</div>\n</div>'
});

