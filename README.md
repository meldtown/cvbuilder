CvBuilder
=========

Set of assets for [RUA-15537](https://rabota.atlassian.net/browse/RUA-15537)


Validation
------------

Dropdowns - remove placeholder???

Experience/period - custom validation
Experience/Description - is it required ?
Experience/save - add else case showing all error messages

Controls
--------

All top level models - add message property

Personal - add photo
Experience/Company - fill other fields
Experience/Recommendation/Name - add placeholder
Experience/Recommendation/Company - add autocomplete
Experience/Recommendation/Contacts - computed phone, email
Experience/Recommendation - add button logic 1 of 3
Experience/save - add else logic to show all error messages

All controls - tooltips? cross button? focus? wtf?

Markup
------

experience

Computed
--------

Footer buttons
Sidebar percent
Sidebar buttons




Dependencies
------------

 * [Knockout-Validation](https://github.com/Knockout-Contrib/Knockout-Validation)
 * [ko.editables](https://github.com/romanych/ko.editables)

Build
-----

	npm install
	npm test
	gulp dist

Artifacts
---------

	dist/cvbuilder.js
	dist/cvbuilder.css
	dist/cvbuilder.html

Last one contains templates that should be injected into main page.

WebStorm
--------

Mark `coverage` and `dist` folders as excluded. `node_modules` as resources root and `spec` as tests root.

Marking is done via right clicking on folder and choosing appropriate action in context menu.

TODO
----

 * <s>Injecting HTML templates into main page may be done better somehow</s>
 * <s>Logic for arrays are in CvBuilderModel which is bad for collaborative work</s>
 * Extract save method from models

Notices
-------

We can not give parent model to child models because of editable will make them both start editing

Backend bad request validation errors response example:

	{
	  "message": "The request is invalid.",
	  "modelState": {
		"data.FirstName": [
		  "Name is required EN \"MAC\"\r\n<font color=\"red\">was</font> here"
		],
		"data.LastName": [
		  "The LastName field is required."
		],
		"data.FavoriteColor": [
		  "The FavoriteColor field is required.",
		  "Invalid value"
		],
		"data.Email": [
		  "The Email field is required."
		]
	  }
	}


Possible backend responses that should be catched:

404 - not found
403 - forbidden
400 - bad request


Each model should have:

 * fields like in backend
 * save/get methods
 * get method may catch 404, 403
 * save method may catch 403, 400

Each test should check:

 * validation rules
 * handling 400 (backend errors)

Browser Sync
============

	npm install -g browser-sync
	browser-sync start -c bs-config.js
