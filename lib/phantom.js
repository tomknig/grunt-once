var system = require('system');

function renderPage() {
    if (system.args.length === 3) {
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
                    output = page.evaluate(function () {
                        return window.isRenderable;
                    });
                    
                    if (JSON.stringify(output) !== 'true') {
                        setTimeout(function () {
                            renderState();
                        }, 500);
                    } else {
                        output = page.evaluate(function () {
                            return document.getElementsByTagName('html')[0].outerHTML;
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
