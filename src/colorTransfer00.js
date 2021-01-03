const { createCanvas, loadImage } = require('canvas');

module.exports = function colorTransfer00(ctx) {
  const brain = require("brain.js");
  const canned = `{"sizes":[3,3,3],"layers":[{"0":{},"1":{},"2":{}},{"0":{"bias":5.430312156677246,"weights":{"0":1.393426775932312,"1":-6.510793209075928,"2":-6.989658355712891}},"1":{"bias":0.26783308386802673,"weights":{"0":-6.64335298538208,"1":0.6966207027435303,"2":1.2615540027618408}},"2":{"bias":1.4619407653808594,"weights":{"0":-1.8954782485961914,"1":-7.879184246063232,"2":-6.088111400604248}}},{"0":{"bias":4.595202922821045,"weights":{"0":-3.2425591945648193,"1":-8.354876518249512,"2":-0.8559690117835999}},"1":{"bias":5.541392803192139,"weights":{"0":-5.382877826690674,"1":0.029835661873221397,"2":-6.2881927490234375}},"2":{"bias":5.853871822357178,"weights":{"0":-6.227881908416748,"1":0.12190339714288712,"2":-5.814660549163818}}}],"outputLookup":false,"inputLookup":false,"activation":"sigmoid","trainOpts":{"iterations":20000,"errorThresh":0.005,"log":false,"logPeriod":10,"learningRate":0.3,"momentum":0.1,"callbackPeriod":10,"beta1":0.9,"beta2":0.999,"epsilon":1e-8}}`;
  const model = new brain.NeuralNetwork().fromJSON(JSON.parse(canned));
  
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const im = ctx.getImageData(0, 0, w, h);
  
  const canvas = createCanvas(w, h);
  const context = canvas.getContext('2d', { ___pixelFormat: 'A8' }),
    imageData = context.getImageData(0, 0, im.width, im.height),
    { data } = imageData;
    
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
  return context;
}
