var system = require('system'),
      tempfile = system.args[2];

function saveHTMLToFile(page) {
    var output = page.evaluate(function () {
        return document.getElementsByTagName('html')[0].innerHTML;
    });

    fs.write(tempfile, output, 'w');
    phantom.exit();
}

function waitForCondition(page) {
    var conditionValue = page.evaluate(function () {
        return window.isOnceFinished;
    });

    fs.write(tempfile, conditionValue, 'w');
    phantom.exit();
}

function renderPage() {
    if (system.args.length === 3) {
        var website = system.args[1],
            page = require('webpage').create(),
            fs = require('fs');

        page.settings.userAgent = 'SpecialAgent';

        page.open(website, function (status) {
            var output;
            
            if (status !== 'success') {
                output = 'The default user agent is ' + page.settings.userAgent;
                output += '\n' + 'Unable to access file/network';

                fs.write(tempfile, output, 'w');
                phantom.exit();
            } else {
                waitForCondition(page);
            }
        });
    } else {
        phantom.exit();
    }
}

renderPage();
