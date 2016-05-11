CvBuilder
=========

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



Things to consider:

# Injecting HTML templates should be rethinked
# Logic for arrays are in CvBuilderModel which is bad for coloborative work

