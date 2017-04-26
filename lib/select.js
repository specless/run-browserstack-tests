var generator = require('./generator');
module.exports = select;

function select(queries) {
    var cached = {};
    var qs = queries.split('+').map(function (query) {
        var args = query.split(' ');
        var offset = 5 - args.length;
        var a = args.concat(Array(offset));
        return createQuery.apply(null, a);
    });
    return generator().then(function (browsers) {
        return browsers.filter(function (browser) {
            return qs.find(function (query) {
                var keys = Object.keys(query);
                return keys.reduce(function (matches, key, index) {
                    var value = query[key];
                    var browser_value = browser[key];
                    if (value === 'any') {
                        return matches;
                    }
                    return matches && browser_value && distillString(value)(browser_value);
                }, true);
            });
        });
    }).catch(function (e) {
        console.log(e);
        return [];
    });
}

function createQuery(device, os, os_version, browser, browser_version) {
    return {
        device: device ? device.trim() : 'any',
        os: os ? os.trim() : 'any',
        os_version: os_version ? os_version.trim() : 'any',
        browser: browser ? browser.trim() : 'any',
        browser_version: browser_version ? browser_version.trim() : 'any'
    };
}

function distillString(val1_) {
    var distilled, val1 = bare(val1_),
        first = val1[0],
        characterIsEqual;
    if (first === '~') {
        val1 = val1.slice(1);
        distilled = function (val2) {
            return fuzzyMatch(val1, bare(val2));
        };
    } else if (first === '>') {
        val1 = val1.slice(1);
        if (characterIsEqual(val1[1])) {
            val1 = val1.slice(1);
            distilled = function (val2) {
                return val1 <= bare(val2);
            };
        } else {
            distilled = function (val2) {
                return val1 < bare(val2);
            }
        }
    } else if (first === '<') {
        val1 = val1.slice(1);
        if (characterIsEqual(val1[1])) {
            val1 = val1.slice(1);
            distilled = function (val2) {
                return val1 >= bare(val2);
            };
        } else {
            distilled = function (val2) {
                return val1 > bare(val2);
            }
        }
    } else {
        distilled = function (val2) {
            return val1 === bare(val2);
        };
    }
    return distilled;
}

function characterIsEqual(character) {
    return character === '=';
}

function bare(string) {
    return string.trim().replace(/\s/igm, '').toLowerCase();
}

function fuzzyMatch(a, b) {
    return b.indexOf(a) !== -1;
}