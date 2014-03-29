var fs = require('fs')
var path = require('path')

var Watcher = require('watch-fs').Watcher;

var imagemagick = require('imagemagick-native')
// ------------ SETTINGS --------------
var opts =  {
    resizeStyle: "aspectfill",
    quality: 90,
    format: 'JPEG'
}

var targets =[
  {
    width: 100,
    height: 100
  },
  {
    width: 200,
    height: 200
  }
]

targets.forEach(function (target) {
    target.__proto__ = opts;
})
// --------------------------------------


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
        resize(file, t);
    })
})
watcher.start(function (err) {
    if (err) throw err;
    console.log('started watching')
})

function resize (file, target) {
    var height = target.height
    var width = target.width
    var newName = file.replace('.', '_' + height + 'x' + width + '.')

    sharp(file)
        .resize(width, height)
        .write(newName, function(err) {
              if (err) {
                  throw err;
              }
              console.log("Wrote " + newName)
         });
}
