var fs = require('fs')
var path = require('path')

var Watcher = require('watch-fs').Watcher;
var resize = require("kb-resize");

var args = process.argv;
var image_dir = args.pop();
var targets = JSON.parse(fs.readFileSync(args.pop));

var watcher = new Watcher({
    paths: [ 'upload' ],
    filters: {
        includeFile: function(name) {
            return /\.png/.test(name) || /\.jpg/.test(name);
        }
    }
});

watcher.on('create', function (name) {
    targets.forEach(function (t) {
        resize(file, t, function (err) {
          console.error(err)
        });
    })
});

watcher.start(function (err) {
    if (err) throw err;
    console.log('started watching')
});
