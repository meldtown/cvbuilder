CvBuilder
=========

Set of assets for [RUA-15537](https://rabota.atlassian.net/browse/RUA-15537)

Tasks
-----

 * Make .greeting-popup(s) fluid not fixed height
 * Fix computed that allows resume publication
 * Disable "Update date" button if resume is not published RUA-16154
 * Remove email from sidebar
 * Remove more toggler from sidebar
 * RUA-16150
 * Ask AlexR what to do when there is 5 resumes and user press copy button
 * After saving/removing edu/exp should call status.get to update header
 * Configure IIS for local dev
 * Make one request at start instead of 100500

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
