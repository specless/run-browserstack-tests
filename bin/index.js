#!/usr/bin/env node

var select = require('../lib/');
var argv = require('argv');
var path = require('path');
argv.option([{
    name: 'query',
    type: 'string',
    short: 'q'
}, {
    name: 'config',
    type: 'string',
    short: 'c'
}]);
var results = argv.run().options;
if (!results.config) {
    throw new Error('run-browserstack-tests needs a config');
}
var config = require(results.config);
var test_path = config.test_path;
var skips = {
    '/': true,
    '~': true
};
if (!skips[test_path[0]]) {
    config.test_path = path.join(path.dirname(results.config), test_path);
}
select(config, results.query);