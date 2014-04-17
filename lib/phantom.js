var system = require('system');

function renderPage() {
	if (system.args.length === 4) {
		var options = system.args[3],
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
					var head = document.getElementsByTagName('HEAD')[0],
						numberOfTags,
						tags,
						tag,
						i;

					output = page.evaluate(function () {
						return window.isRenderable;
					});

					if (JSON.stringify(output) !== 'true') {
						setTimeout(function () {
							renderState();
						}, 500);
					} else {
						if (options.mergeStylesheets === true) {
							tags = head.getElementsByTagName('LINK');
							numberOfTags = tags.length;
							for (i = 0; i < numberOfTags; i += 1) {
								head.removeChild(tags[0]);
							}
							tag = document.createElement('LINK');
							tag.setAttribute('href', 'main.css');
							tag.setAttribute('media', 'all');
							tag.setAttribute('rel', 'stylesheet');
							head.appendChild(tag);
						}
						if (options.mergeScripts === true) {
							tags = head.getElementsByTagName('SCRIPT');
							numberOfTags = tags.length;
							for (i = 0; i < numberOfTags; i += 1) {
								head.removeChild(tags[0]);
							}
							tag = document.createElement('SCRIPT');
							tag.setAttribute('src', 'main.js');
							tag.setAttribute('type', 'text/javascript');
							head.appendChild(tag);
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
