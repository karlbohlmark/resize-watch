#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var imageSize = require("image-size");

var Watcher = require('watch-fs').Watcher;
var watch = require("node-watch");
var resize = require("kb-resize");

var args = process.argv;
if (args.length < 4) {
  console.log("Usage:", "resize-watch <imagedir> <targets-file>")
  process.exit();
}
var targets = JSON.parse(fs.readFileSync(args.pop()));
var image_dir = args.pop();

watch(image_dir, function (name) {
    if (name.indexOf('.DS_Store') !== -1) return;
    if (!fs.existsSync(name)) {
        console.log(name, "doesnt exist, returning")
        return
    }
    var dimension = imageSize(name);
    var filename = path.basename(name)
    targets.forEach(function (t) {
        var opt = JSON.parse(JSON.stringify(t))
        opt.outfile = filename.replace(".", "_" + t.width + "x" + t.height + ".")
        var w = t.width/dimension.width;
        var h = t.height/dimension.height;
        if (w < h) {
            opt.height = w * dimension.height;
        } else {
            opt.width = h * dimension.width;
        }
        opt.outdir = "resized";

        resize(name, opt, function (err) {
          console.error(err)
        });
    })
});
