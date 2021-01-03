const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const commander = require("commander");
const ConvertTiff = require('tiff-to-png');
const tiff = new ConvertTiff();

commander
  .version(require("../package.json").version)
  .usage("[options] [file]")
  .option("-i, --in <dir>", "input dir name", "in")
  .option("-o, --out <dir>", "output dir name", "out")
  .option("-f, --filter <filter>", "choose a filter (hueblur, colorTransfer00)", "")
  .option("-r, --radius <radius>", "choose a radius (for hueblur)", 3)
  .parse(process.argv);

let filter = null;
switch(commander.filter) {
  case "colorTransfer00":
    filter = require("./colorTransfer00.js");
    break;
  case "hueblur":
    const hueblur = require("./hueblur.js");
    filter = hueblur(commander.radius);
    break;
  default:
    console.warn("no filter given");
    filter = ctx => ctx;
    break;
}

fs.mkdirSync(commander.out, {recursive: true});

(async function() {

fs.readdir(commander.in, async (err, files) => {
  for (const f of files) {
    const r = f.match(/.(jpe?g|png|tiff?)$/);
    if (r) {
      console.warn("reading", path.resolve(commander.in, f));
      let f0 = path.resolve(commander.in, f);
      if (r[1] === "tiff" || r[1] === "tif") {
        const dir = "/tmp/" + path.basename(f0, "." + r[1]);
        await tiff.convertOne(f0, "/tmp/");
        f0 = dir + "/0.png";
      }
      const dest = path.resolve(commander.out, path.basename(f, "." + r[1]) + ".png");
      await loadImage(f0).then(async im => {
        const out = fs.createWriteStream(dest);
        const w = im.naturalWidth, h = im.naturalHeight;
        const canvas = createCanvas(w, h);
        const ctx = canvas.getContext('2d', { ___pixelFormat: 'A8' });
        ctx.drawImage(im, 0, 0, w, h);
      
        const ctx2 = filter(ctx);
        ctx2.canvas.createPNGStream().pipe(out);
        await new Promise(f => out.on('finish', f));
        console.warn("…", dest);
      });
    }
  }
});




})()
