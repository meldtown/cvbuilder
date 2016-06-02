CvBuilder
=========

Set of assets for [RUA-15537](https://rabota.atlassian.net/browse/RUA-15537)


Validation
------------

Dropdowns - remove placeholder???

+ Personal/Moving - remove validation, skip empty on save
Contacts/Phone - add validation, is it required ?
Contacts/Email - i18n custom message
Contacts/Additional Phone - custom validation, skip empty on save, without require
Contacts/Portfolio -  skip empty on save
Contacts/Social -  skip empty on save
Position/Salary - custom validation, is it required  ?
Position/Currency - validate only if salary presents
Experience/Branch - is it required ?
Experience/period - custom validation
Experience/Description - is it required ?
Experience/recommendation/* - is it required ?
Education/* - is it required? should diploma and speciality be validated for school education type...
Trainings/Description - is it required ?
Trainings/Year - is it required ?
Additional/Description - is it required ?

Controls
--------

All top level models - add message property

Personal - add photo
Personal/City - custom control
+ Personal/moving- hide already selected cities or skip them before save
- Personal/moving/add - hide button (not needed there is no chance that there will be cv without cityId defined)
Contacts/Additional phones - show/hide logic
Contacts/portfolio - add button computed show/hide, force one item, remove button only from second
Position/Speciality - add autocomplete
Experience/Company - add autocomplete, fill other fields
Experience/Position - add autocomplete
Experience/Description - tiny ?
Expeince/Recommendation/Name - add placeholder
Experience/Recommendation/Position - add autocomplete
Experience/Recommendation/Company - add autocomplete
Experience/Recommendation/Contacts - computed phone, email
Experience/Recommmendation - add button logic
Education/School name - computed from school type
Education/City - is it dropdown ?
Education/diploma - show/hide from school type ? (validation ?)
Training/Description - tiny ?
Additional/predefined titles - disable other inputs
Additional/Description - tiny ?
Language/language name - computed
Language/checkbox - show/hide from skill ?

All controls - tooltips? cross button? focus? wtf?

Markup
------

Contacts/portfolio and additional phones - add input-block-level class
all block/edit mode - check for input-block-level, add grids if needed
personal/additional cities/view - waiting for desing/ux decision
contacts
position
experience
education
skill
training
additional
language

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
