# webkit-opener
 [![Build Status](https://secure.travis-ci.org/jakub-g/webkit-opener.png)](http://travis-ci.org/jakub-g/webkit-opener)

 [![Get it on npm](https://nodei.co/npm/webkit-opener.png?compact=true)](https://www.npmjs.org/package/webkit-opener)


This module tries to open the provided URL in some webkit-based browser available on the machine.
It prefers the default browser of the user (as long as it's webkit), otherwise, it tries
Chrome, Opera, Chromium in that order.

If no webkit browsers found, it doesn't launch anything, just calls the callback with an error.

Tested on Windows 7 64-bit, Windows XP 32-bit, Ubuntu 14.04 64-bit (en-US locale).

It requires nodejs and npm. If you don't have node, grab it at [nodejs.org](https://nodejs.org).
Node installer bundles npm (node package manager)

## Rationale

Certain applications require certain webkit-only features (for instance, Node Inspector).
For that apps, it makes sense to only open a URL in a webkit browser, otherwise tell the user
about the error instead of opening the URL in unsupported browser.


## Usage as a nodejs module

```sh
$ npm install webkit-opener
```

```js
var webkitOpener = require('webkit-opener');

var url = "http://example.org";
var verbose = true;

webkitOpener(url, {verbose:verbose}, function(err) {
    if (err) {
        // didn't find any webkit browser, or there was some failure while launching it
    }
});
```


## Usage from command line

```sh
$ npm install -g webkit-opener
$ webkit-opener --verbose http://example.org
```


## Linux support

This module was only tested on Ubuntu. Compatibility reports and fixes for other distros are more than welcome!
Use GitHub issues or email: (jakub.g.opensource) (gmail)


## License

MIT © [Jakub Gieryluk](http://jakub-g.github.io)


## Related projects

*   [browser-launcher2](https://github.com/benderjs/browser-launcher2) (cross-platform)
*              [opener](https://github.com/domenic/opener) (cross-platform)
