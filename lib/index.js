var browserstackRunner = require('browserstack-runner');
require('console.table');
module.exports = stack;
var select = require('./select');

function stack(options, query) {
    var opts = Object.assign({
        timeout: 180,
        test_framework: "jasmine",
        local: true
    }, options);
    return select(query).then(function (browsers) {
        console.log(browsers.length);
        if (!browsers.length) {
            return;
        }
        opts.browsers = browsers;
        console.table(browsers);
        return run(opts);
    }).catch(function (e) {
        console.log(e);
    });
}

function run(config) {
    return new Promise(function (success, failure) {
        browserstackRunner.run(config, function (error, report) {
            if (error) {
                console.log("Error:" + error);
                failure(error);
            } else {
                success(report);
            }
        });
    });
}