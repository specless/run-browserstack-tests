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
}, {
    name: 'username',
    type: 'string',
    short: 'u'
}, {
    name: 'key',
    type: 'string',
    short: 'k'
}, {
    name: 'test_path',
    type: 'string',
    short: 'f'
}]);
var config, results = argv.run().options;
if (results.username) {
    config = results;
} else {
    if (!results.config) {
        throw new Error('run-browserstack-tests needs a config');
    }
    config = require(results.config);
}
var test_path = config.test_path = typeof config.test_path === 'string' ? [config.test_path] : config.test_path;
var skips = {
    '/': true,
    '~': true
};
if (!skips[test_path[0][0]]) {
    config.test_path = test_path.map(function (test_path) {
        return path.join(path.dirname(results.config), test_path);
    });
}
select(config, results.query);