const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas')
const commander = require("commander");
const ConvertTiff = require('tiff-to-png');
const tiff = new ConvertTiff();

commander
  .version(require("../package.json").version)
  .usage("[options] [file]")
  .option("-i, --in <dir>", "input dir name", "in")
  .option("-o, --out <dir>", "output dir name", "out")
  .parse(process.argv);

const brain = require("brain.js");

const canned = `{"sizes":[3,3,3],"layers":[{"0":{},"1":{},"2":{}},{"0":{"bias":5.430312156677246,"weights":{"0":1.393426775932312,"1":-6.510793209075928,"2":-6.989658355712891}},"1":{"bias":0.26783308386802673,"weights":{"0":-6.64335298538208,"1":0.6966207027435303,"2":1.2615540027618408}},"2":{"bias":1.4619407653808594,"weights":{"0":-1.8954782485961914,"1":-7.879184246063232,"2":-6.088111400604248}}},{"0":{"bias":4.595202922821045,"weights":{"0":-3.2425591945648193,"1":-8.354876518249512,"2":-0.8559690117835999}},"1":{"bias":5.541392803192139,"weights":{"0":-5.382877826690674,"1":0.029835661873221397,"2":-6.2881927490234375}},"2":{"bias":5.853871822357178,"weights":{"0":-6.227881908416748,"1":0.12190339714288712,"2":-5.814660549163818}}}],"outputLookup":false,"inputLookup":false,"activation":"sigmoid","trainOpts":{"iterations":20000,"errorThresh":0.005,"log":false,"logPeriod":10,"learningRate":0.3,"momentum":0.1,"callbackPeriod":10,"beta1":0.9,"beta2":0.999,"epsilon":1e-8}}`;

model = new brain.NeuralNetwork().fromJSON(JSON.parse(canned));

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
        const canvas = transferImage(im, model);
        canvas.createPNGStream().pipe(out);
        await new Promise(f => out.on('finish', f));
        console.warn("…", dest);
      });
    }
  }
});



function transferImage(image, model) {
  const w = image.naturalWidth, h = image.naturalHeight;
  
  const canvas0 = createCanvas(w, h)
  const ctx = canvas0.getContext('2d', { ___pixelFormat: 'A8' })
  ctx.drawImage(image, 0, 0, w, h);
  const im = ctx.getImageData(0, 0, w, h);

  const canvas = createCanvas(w, h);
  const context = canvas.getContext('2d', { ___pixelFormat: 'A8' }),
    imageData = context.getImageData(0, 0, im.width, im.height),
    { data } = imageData;

  canvas.style = `max-width:${940}px`;
  for (let i = 0; i < im.data.length / 4; i++) {
    const pixel = [
      im.data[4 * i + 0] / 256,
      im.data[4 * i + 1] / 256,
      im.data[4 * i + 2] / 256
    ];
    const p = model.run(pixel);
    data[4 * i + 0] = 256 * p[0];
    data[4 * i + 1] = 256 * p[1];
    data[4 * i + 2] = 256 * p[2];
    data[4 * i + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
  return canvas;
}

})()
