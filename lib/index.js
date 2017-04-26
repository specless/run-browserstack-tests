module.exports = stack;
var browserstackRunner = require('browserstack-runner-fix');
var select = require('./select');
require('console.table');

function stack(options, query) {
    var opts = Object.assign({
        timeout: 180,
        test_framework: "jasmine2",
        local: true
    }, options);
    return select(query).then(function (browsers) {
        if (!browsers.length) {
            console.log('No browsers found matching your query.');
            return;
        }
        opts.browsers = browsers;
        console.table(browsers);
        return run(opts);
    }).catch(function (e) {
        console.log(e);
        throw e;
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