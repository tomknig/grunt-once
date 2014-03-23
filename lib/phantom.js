var system = require('system');

function renderPage() {
    if (system.args.length === 3) {
        var tempfile = system.args[2],
            website = system.args[1],
            page = require('webpage').create(),
            fs = require('fs');

        page.settings.userAgent = 'SpecialAgent';

        page.open(website, function (status) {
            var output = '',
                grabState;
            
            if (status !== 'success') {
                output = 'The default user agent is ' + page.settings.userAgent;
                output += '\n' + 'Unable to access file/network';

                fs.write(tempfile, output, 'w');
                phantom.exit();
            } else {
                grabState = function () {
                    output = page.evaluate(function () {
                        return window.isOnceFinished;
                    });
                    
                    if (JSON.stringify(output) !== 'true') {
                        setTimeout(function () {
                            grabState();
                        }, 500);
                    } else {
                        output = page.evaluate(function () {
                            return document.getElementsByTagName('html')[0].outerHTML;
                        });
                        fs.write(tempfile, output, 'w');
                        phantom.exit();
                    }
                };
                
                grabState();
            }
        });
    } else {
        phantom.exit();
    }
}

renderPage();
