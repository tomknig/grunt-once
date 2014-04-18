var system = require('system');

function renderPage() {
	if (system.args.length === 8) {
		var mergeScripts = system.args[3],
			mergeStylesheets = system.args[4],
			mergedScriptPath = system.args[5],
			mergedStylesheetPath = system.args[6],
			render = system.args[7],
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
					var fileContent ='';

					output = page.evaluate(function () {
						return window.isRenderable;
					});

					if (JSON.stringify(render) === '"true"' && JSON.stringify(output) !== 'true') {
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

							fileContent = fs.read(mergedStylesheetPath);
							fs.remove(mergedStylesheetPath);

							page.evaluate(function (c) {
								var maincss = document.createElement('STYLE');
								maincss.setAttribute('type', 'text/css');
								maincss.innerHTML = c;
								document.head.appendChild(maincss);
							}, fileContent);

						}
						if (JSON.stringify(mergeScripts) === '"true"') {
							page.evaluate(function () {
								while(document.head.getElementsByTagName('SCRIPT').length--) {
									document.head.removeChild(document.head.getElementsByTagName('SCRIPT')[0]);
								}
							});

							fileContent = fs.read(mergedScriptPath);
							fs.remove(mergedScriptPath);

							page.evaluate(function (c) {
								var mainjs = document.createElement('SCRIPT');
								mainjs.setAttribute('type', 'text/javascript');
								mainjs.innerHTML = c;
								document.head.appendChild(mainjs);
							}, fileContent);
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
