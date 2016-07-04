CvBuilder
=========

Set of assets for [RUA-15537](https://rabota.atlassian.net/browse/RUA-15537)

Tasks
-----

 * Disable or hide copy button if there is more than X resume
 * Icon font

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

Browser Sync
============

	npm install -g browser-sync
	browser-sync start -c bs-config.js
