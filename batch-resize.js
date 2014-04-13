var fs = require('fs')
var path = require("path")

var readSync = fs.readFileSync;
var existsSync = fs.existsSync

var imageSize = require("image-size");
var resize = require("kb-resize");

var args = process.argv

var targetFile = args.pop()
var outdir = args.pop()
var sourcedir = args.pop()

var targets = JSON.parse(readSync(targetFile).toString())

var files = fs.readdirSync(sourcedir);

files.forEach(resizeImage)

function resizeImage(filename) {
    if (!isImage(filename)) {
        return
    }

    filename = path.join(sourcedir, filename);

    var dimension = imageSize(filename);
    fname = path.basename(filename)

    targets.forEach(function (t) {
        t = Object.create(t);
        t.outfile = fname.replace(".", "_" + t.width + "x" + t.height + ".")
        if (existsSync(t.outfile)) {
            console.log("skipping", filename, t.width, t.height);
            return;
        }

        var w = t.width/dimension.width;
        var h = t.height/dimension.height;
        if (w < h) {
            t.height = w * dimension.height;
        } else {
            t.width = h * dimension.width;
        }
        t.outdir = outdir;

        resize(filename, t, function (err) {
          //console.error(err)
        });
    })    
}

function isImage(f) {
    return [/\.png$/, /\.jpg$/, /\.jpeg$/].some(function (p) {
        return p.test(f);
    })
}