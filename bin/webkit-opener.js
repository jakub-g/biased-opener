#!/usr/bin/env node

var webkitOpener = require('../index');

function printUsage() {
    console.error("Usage: webkit-opener <url>");
    console.error("       webkit-opener --verbose <url>");
    console.error("       webkit-opener -h");
    console.error("       webkit-opener --help");
    process.exit(1);
}

function main () {
    var verbose = false;

    var p2 = process.argv[2];
    if (p2 == "-h" || p2 == "--help") {
        printUsage();
    }
    var url;
    if (p2 == "--verbose") {
        verbose = true;
        url = process.argv[3];
    } else {
        url = process.argv[2];
    }
    if (!url || url.charAt(0) == "-") {
        printUsage();
    }

    webkitOpener(url, {verbose:verbose});
}

main();