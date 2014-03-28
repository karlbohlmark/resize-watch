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
        return /\.js/.test(name);
    }
}});

watcher.on('create', function (name) {
    console.log("CREATED ", name)
})
watcher.start(function (err) {
    console.log('started watching', err)
})

function resize (file, target) {
    var srcData = fs.readFileSync(file)
    var imageMagickOptions = {srcData: srcData}
    imageMagickOptions.__proto__ = target
    var resizedBuffer = imagemagick.convert(imageMagickOptions);
    var width = imageMagickOptions.width
    var height = imageMagickOptions.height
    var newName = file.replace('.', '_' + height + 'x' + width + '.')
    console.log('create',  newName)
    require('fs').writeFileSync(newName, resizedBuffer, 'binary');
}