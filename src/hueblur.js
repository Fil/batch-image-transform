/*
 * Reference code https://observablehq.com/@fil/hue-blur
 */

const {blur} = require("array-blur");
const {lab, rgb} = require("d3");
const { createCanvas, loadImage } = require('canvas');

module.exports = function hueblur(radius) {
  return function (context) {
    // read pixels
    const w = context.canvas.width, h = context.canvas.height;
    const m = context.getImageData(0, 0, w, h), data = m.data;
    
    // process
    const labpixels = Array.from({ length: data.length / 4 }, (_, i) =>
      lab(rgb(data[4 * i], data[4 * i + 1], data[4 * i + 2]))
    );
    
    const a = blur().radius(radius).width(w).value(d => d.a)(labpixels);
    const b = blur().radius(radius).width(w).value(d => d.b)(labpixels);
    const l = blur().radius(0).width(w).value(d => d.l)(labpixels);
    
    labpixels.forEach((d, i) => {
      d.l = l[i];
      d.a = a[i];
      d.b = b[i];
      d = rgb(d);
      data[4 * i + 0] = d.r;
      data[4 * i + 1] = d.g;
      data[4 * i + 2] = d.b;
    });

    // write back
    context.putImageData(m, 0, 0);
    
    return context;
  }
}
