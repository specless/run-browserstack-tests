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
                    // console.log(value, browser_value);
                    return matches && browser_value && distillString(value)(browser_value);
                }, true);
            });
        }).sort(sortEnv);
    }).catch(function (e) {
        console.log(e);
        return [];
    });
}

function sortEnv(a, b) {
    if (a.device !== b.device) {
        return compare('device');
    }
    if (a.os !== b.os) {
        return compare('os');
    }
    if (a.os_version !== b.os_version) {
        return compare('os_version');
    }
    if (a.browser !== b.browser) {
        return compare('browser');
    }
    if (a.browser_version !== b.browser_version) {
        return compare('browser_version');
    }
    return 0;

    function compare(key) {
        return a[key] > b[key] ? 1 : -1;
    }
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
        first = val1[0];
    if (first === '~') {
        val1 = val1.slice(1);
        distilled = function (val2) {
            return fuzzyMatch(val1, bare(val2));
        };
    } else if (first === '>') {
        val1 = val1.slice(1);
        if (characterIsEqual(val1[0])) {
            val1 = val1.slice(1);
            distilled = function (val2) {
                return +val1 <= +bare(val2);
            };
        } else {
            distilled = function (val2) {
                return +val1 < +bare(val2);
            }
        }
    } else if (first === '<') {
        val1 = val1.slice(1);
        if (characterIsEqual(val1[1])) {
            val1 = val1.slice(1);
            distilled = function (val2) {
                return +val1 >= +bare(val2);
            };
        } else {
            distilled = function (val2) {
                return +val1 > +bare(val2);
            }
        }
    } else {
        distilled = function (val2) {
            return +val1 === +val1 ? +val1 === +val2 : val1 === bare(val2);
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