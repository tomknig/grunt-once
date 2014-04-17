var system = require('system');

function renderPage() {
	if (system.args.length === 5) {
		var mergeStylesheets = system.args[3],
			mergeScripts = system.args[4],
			tempfile = system.args[2],
			website = system.args[1],
			page = require('webpage').create(),
			fs = require('fs');

		page.viewportSize = {
			width: 4096,
			height: 2304
		};

		page.open(website, function (status) {
			var output = '',
				renderState;

			if (status !== 'success') {
				output = 'The default user agent is ' + page.settings.userAgent;
				output += '\n' + 'Unable to access file/network';

				fs.write(tempfile, output, 'w');
				phantom.exit();
			} else {
				renderState = function () {
					output = page.evaluate(function () {
						return window.isRenderable;
					});

					if (JSON.stringify(output) !== 'true') {
						setTimeout(function () {
							renderState();
						}, 500);
					} else {
						if (JSON.stringify(mergeStylesheets) === '"true"') {
							page.evaluate(function () {
								while(document.head.getElementsByTagName('LINK').length--) {
									document.head.removeChild(document.head.getElementsByTagName('LINK')[0]);
								}
							});

							page.evaluate(function () {
								var maincss = document.createElement('LINK');
								maincss.setAttribute('href', 'main.css');
								maincss.setAttribute('media', 'all');
								maincss.setAttribute('rel', 'stylesheet');
								document.head.appendChild(maincss);
							});
						}
						if (JSON.stringify(mergeScripts) === '"true"') {
							page.evaluate(function () {
								while(document.head.getElementsByTagName('SCRIPT').length--) {
									document.head.removeChild(document.head.getElementsByTagName('SCRIPT')[0]);
								}
							});

							page.evaluate(function () {
								var mainjs = document.createElement('SCRIPT');
								mainjs.setAttribute('src', 'main.js');
								mainjs.setAttribute('type', 'text/javascript');
								document.head.appendChild(mainjs);
							});
						}

						output = page.evaluate(function () {
							return document.getElementsByTagName('HTML')[0].outerHTML;
						});
						fs.write(tempfile, output, 'w');
						phantom.exit();
					}
				};
				renderState();
			}
		});
	} else {
		phantom.exit();
	}
}

renderPage();
