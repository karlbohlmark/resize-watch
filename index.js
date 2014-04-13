#!/usr/bin/env node

var fs = require('fs')
var path = require('path')

var Watcher = require('watch-fs').Watcher;
var resize = require("kb-resize");

var args = process.argv;
if (args.length < 4) {
  console.log("Usage:", "resize-watch <imagedir> <targets-file>")
  process.exit();
}
var targets = JSON.parse(fs.readFileSync(args.pop()));
var image_dir = args.pop();

var watcher = new Watcher({
    paths: [ image_dir ],
    filters: {
        includeFile: function(name) {
            return /\.png/.test(name) || /\.jpg/.test(name) || /\.jpeg/.test(name);
        }
    }
});

watcher.on('create', function (name) {
    targets.forEach(function (t) {
        t.outdir = "resized";
        resize(name, t, function (err) {
          console.error(err)
        });
    })
});

watcher.start(function (err) {
    if (err) throw err;
    console.log('started watching')
});
