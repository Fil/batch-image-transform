# batch image transform

Use this code to read images from a directory, transform them with something,
and export the result in another directory.

Reads in many formats (tiff, jpg, png…).

Outputs png.

## Installation & usage

clone this repository, then call `yarn` to install dependencies.

then call 
~~~js
node index.js --help
~~~
to get a list of options.


## Filters

### * to png

when no filter is given, this just converts to png:

~~~js
node index.js --in /path/to/inputs/ --out /path/to/outputs-blur-3/
~~~

### hue blur

See https://observablehq.com/@fil/hue-blur for the code

~~~js
node index.js --filter hueblur --radius 3 --in /path/to/inputs/ --out /path/to/outputs-blur-3/
~~~

### color-transfer

This was my first application, the filter itself is specific to a certain
image sequence and not generic.

~~~js
node index.js --filter colorTransfer00 --in /path/to/inputs/ --out /path/to/outputs-blur-3/
~~~

This code is kept here for no good reason, will be removed at some point.

