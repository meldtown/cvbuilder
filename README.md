CvBuilder
=========

Set of assets for [RUA-15537](https://rabota.atlassian.net/browse/RUA-15537)

Tasks
-----

 * What happens after resume copy from sidebar? - open new window with copied cv
 * What happens after resume remove from sidebar? - temporary hide
 * Add confirm dialogs to remove links (edu, exp, trainins, languages, additional)
 * Add confirm dialog to resume remove
 * After saving/removing edu/exp should call status.get to update header
 * Configure IIS for local dev
 * Если пользователь выбирает Анонимное резюме, то скрываем: Имя, контакты, название компаний в которых работал. https://rabota.atlassian.net/secure/attachment/38678/38678_cvbuilder_mainPgae_anonim.png

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
