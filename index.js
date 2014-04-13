#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var imageSize = require("image-size");

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
    var dimension = imageSize(name);
    var filename = path.basename(name)
    targets.forEach(function (t) {
        t.outfile = filename.replace(".", "_" + t.width + "x" + t.height + ".")
        var w = t.width/dimension.width;
        var h = t.height/dimension.height;
        if (w < h) {
            t.height = w * dimension.height;
        } else {
            t.width = h * dimension.width;
        }
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
