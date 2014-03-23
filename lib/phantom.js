function renderPage() {
    var system = require('system'),
        output;

    if (system.args.length === 3) {
        var website = system.args[1],
            tempfile = system.args[2],
            page = require('webpage').create(),
            fs = require('fs');

        page.settings.userAgent = 'SpecialAgent';

        page.open(website, function (status) {
            var i;
            
            if (status !== 'success') {
                output = 'The default user agent is ' + page.settings.userAgent;
                output += '\n' + 'Unable to access file/network';
                fs.write(tempfile, output, 'w');
                phantom.exit();
            } else {
                output = page.evaluate(function () {
                    return document.getElementsByTagName('html')[0].innerHTML;
                });
                
                fs.write(tempfile, output, 'w');
                phantom.exit();
            }
        });
    } else {
        phantom.exit();
    }
}

renderPage();
