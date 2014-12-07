var checkDefaultBrowser = require('default-browser-winlin');

// order is subjective
var preferredBrowsers = ['chrome', 'opera', 'chromium'];

/**
 * @param Object{name, version, type, command} item
 * @return true for webkit browsers
 */
function webkitFilter (item) {
    return (preferredBrowsers.indexOf(item.name) > -1);
}

/**
 * @param Array<Object{name, version, type, command}> browsers
 * @return String: "chrome", "opera" or "chromium" or null
 */
function getBrowserCommand(browsers) {
    var filterFunc = function(browserName) {
        return function(item) {
            return item.name == browserName;
        };
    };

    for (var i = 0; i < preferredBrowsers.length; i++) {
        var browserName = preferredBrowsers[i];
        var gotThatBrowser = browsers.some(filterFunc(browserName));

        if (gotThatBrowser) {
            return browserName;
        }
    }

    return null;
}

function useOpener (url, cb) {
    var opener = require('opener');
    opener(url, cb);
}

var webkitOpener;

/**
 * Opens a URL in some webkit browser if available and calls the callback.
 * Otherwise, calls the callback with error
 * cfg defaults to {verbose:false}
 * cb defaults to console.error
 * @param {String} url
 * @param optional {Object} cfg {verbose: Boolean}
 * @param optional {Function} cb function(error, stdout|okMessage, stderr)
 */
module.exports = webkitOpener = function (url, cfg, cb) {
    cfg = cfg || {};
    cb = cb || (function (err) {
        if (err) console.error(err);
    });

    checkDefaultBrowser(function(err, browserInfo) {
        if (!err && browserInfo.isWebkit) {
            // great, default browser is webkit, let's use opener to open the URL with that browser
            if (cfg.verbose) {
                console.log('Using default browser via opener; it should open ' + browserInfo.commonName);
            }
            return useOpener(url, cb);
        }
        if (cfg.verbose && !browserInfo.isWebkit) {
            console.log('Default brower is ' + browserInfo.commonName + '; looking further for webkit browsers...');
        }

        // either we failed checking for default browser, or default browser is not webkit
        // let's check if we have some webkit-based browser in the system
        var launcher = require('browser-launcher2');
        launcher.detect(function(browsers) {
            browsers = browsers.filter(webkitFilter);
            // console.dir(browsers);

            if (browsers.length === 0) {
                var msg = 'No webkit browsers found in the system! If this is not true, submit a bug report on https://github.com/benderjs/browser-launcher2';
                if (cfg.verbose){
                    console.log(msg);
                }
                return cb(new Error(msg));
            }

            // choose from available webkits in order of preference
            var command = getBrowserCommand(browsers);
            launcher(function(err, launch) {
                // checking err makes sense only when passing config, no need to do it here
                launch(url, command, function(err, instance) {
                    if (err) {
                        var msg = 'Unable to start the executable of ' + command;
                        if (cfg.verbose){
                            console.log(msg);
                        }
                        cb(new Error(msg));
                    }
                    if (cfg.verbose) {
                        console.log('Browser ' + command + ' started with PID:', instance.pid);
                        instance.on('stop', function(code) {
                            console.log('Instance stopped with exit code:', code);
                        });
                    }
                    cb(null, 'Started ' + command + ' successfully');
                });
            });

        });
    });
};
