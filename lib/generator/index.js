module.exports = function () {
    return Promise.resolve(require('../some.json')).then(function (json) {
        return reduce(json, function (memo, obj, os) {
            var handler;
            if ((handler = handlers[os])) {
                // desktop
                return memo.concat(handler(obj));
            } else {
                return memo.concat(mobile(os)(obj));
            }
        }, []);
    });
};
var handlers = {
    Windows: desktop('Windows'),
    'OS X': desktop('OS X'),
    opera: function (sizes) {
        return reduce(sizes, function (memo, browsers, size) {
            return memo.concat(reduce(browsers, function (memo, browser) {
                return memo.concat(map(browser.devices, function (device) {
                    return {
                        device: device,
                        os: 'opera',
                        browser: browser.browser
                    };
                }));
            }, []));
        }, []);
    }
};

function mobile(os) {
    return function (osversions) {
        return reduce(osversions, function (memo, browser, os_version) {
            return memo.concat(reduce(browser, function (memo, browser) {
                return memo.concat(map(browser.devices, function (device) {
                    return {
                        device: device,
                        os: os,
                        os_version: os_version,
                        browser: browser.browser
                    };
                }));
            }, []));
        }, []);
    };
}

function desktop(os) {
    return function (osversions) {
        return reduce(osversions, function (memo, list, os_version) {
            return memo.concat(map(list, function (b) {
                var browser = clone(b);
                browser.os = os;
                browser.os_version = os_version;
                return browser;
            }));
        }, []);
    };
}

function clone(item) {
    return JSON.parse(JSON.stringify(item));
}

function reduce(obj, fn, memo_) {
    var memo = memo_;
    forEach(obj, function (value, key) {
        memo = fn(memo, value, key, obj);
    });
    return memo;
}

function map(obj, fn) {
    return reduce(obj, function (memo, value, key, obj) {
        memo.push(fn(value, key, obj));
        return memo;
    }, []);
}

function filter(obj, fn) {
    return reduce(obj, function (memo, value, key, obj) {
        if (fn(value, key, obj)) {
            memo.push(value);
        }
        return memo;
    }, []);
}

function forEach(obj, fn) {
    return Array.isArray(obj) ? obj.forEach(fn) : Object.keys(obj).forEach(function (key) {
        return fn(obj[key], key, obj);
    });
}