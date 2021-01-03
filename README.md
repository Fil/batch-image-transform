# batch image filter

Use this code to read a sequence of tiff images from a directory, filter
them with something, and export the result in another directory.

Reads in many formats (tiff, jpg, png…).

Outputs png.



## Filters

### color-transfer

This was my first application, the filter itself is specific to a certain
image sequence and not generic. Kept here for no good reason.

### hue blur

See https://observablehq.com/@fil/hue-blur for the code

Usage:

~~~js
node index.js --filter hueblur --radius 3 --in /path/to/inputs/ --out /path/to/outputs-blur-3/
~~~


