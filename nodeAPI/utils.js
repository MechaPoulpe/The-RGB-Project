//String.includes POLYFILL
if ( !String.prototype.includes ) {
    String.prototype.includes = function(search, start) {
      'use strict';
      if (typeof start !== 'number') {
        start = 0;
      } 
  
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search,start) !== -1;
      }
    };
  }



exports.detectType = function (data) {
    var hexRegex = /^(#[a-f0-9]{6}|#[a-f0-9]{3}|rgb *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *\)|rgba *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *\))$/i,
        type;

    if (typeof data != 'string')
        return undefined;

    //trim
    data = data.replace(/\s/g, '');

    if (data.includes('#') && hexRegex.test(data)) {
        type = 'hexadecimal';
    }

    if (data.includes('rgb(')) {
        //Remove last parenthesis
        data = data.substr(4, data.length - 5);
        var splitted = data.split(',');
        if (splitted.length === 3) {
            var r = Number(splitted[0]),
                g = Number(splitted[1]),
                b = Number(splitted[2]);
            if ((typeof r === 'number' && r < 256 && r > -1) && (typeof g === 'number' && g < 256 && g > -1) && (typeof b === 'number' && b < 256 && b > -1))
                type = 'rgb'
        }
    }

    return type;
}

exports.setRGBHEX = function (color) {
    var type = this.detectType(color),
        hex = null,
        rgb = null,
        err = null;

        console.log(type)
    switch (type) {
        case 'hexadecimal':
            hex = color;
            rgb = this.hexToRgb(hex);
            break;

        case 'rgb':
            var tmp = color.substr(4, color.length - 5);
            var splitted = tmp.split(','),
                r = Number(splitted[0]),
                g = Number(splitted[1]),
                b = Number(splitted[2]),
                rgb = {r: r, g: g, b: b, full: color.replace(/\s/g, '')};
            hex = this.rgbToHex(rgb);
            break;
    }

    if (rgb == null || !rgb) 
        err = 'RGB code is invalid';

    if (hex == null || !hex)
        err = 'HEX code is invalid';

    if (!type)
        err = 'Color type is invalid';

    return {
        rgb: rgb,
        hex: hex,
        err: err
    }

}

exports.hexToRgb = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex),
        r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16),
        toReturn;
        if (result) {
            toReturn = {
                r: r,
                g: g,
                b: b,
                full: ['rgb(', [r, g, b].join(','), ')'].join('')
            }
        } else {
            toReturn = null;
        }

        return toReturn;
}

exports.rgbToHex = function (rgb) {

    function componentToHex(c) {
        var hex = Number(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

exports.rgbToHsl = function (rgb){
    var r = Number(rgb.r), g = Number(rgb.g), b = Number(rgb.b);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h =  Math.round(h * 360) + '°';
    s =  Math.round(s * 100) + '%';
    l = Math.round(l * 100) + '%';

    return {
        h: h,
        s: s,
        l: l,
        full: ['hsl(', [h, s, l].join(','), ')'].join('')
    };
}

exports.rgbToHsv = function (rgb) {
    var result = {h: null, s: null, v: null},
        r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255,
        minVal = Math.min(r, g, b),
        maxVal = Math.max(r, g, b),
        delta = maxVal - minVal;

    result.v = maxVal;

    if (delta == 0) {
        result.h = 0;
        result.s = 0;
    } else {
        result.s = delta / maxVal;
        var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta,
            del_G = (((maxVal - g) / 6) + (delta / 2)) / delta,
            del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

        if (r == maxVal) { result.h = del_B - del_G; }
        else if (g == maxVal) { result.h = (1 / 3) + del_R - del_B; }
        else if (b == maxVal) { result.h = (2 / 3) + del_G - del_R; }

        if (result.h < 0) { result.h += 1; }
        if (result.h > 1) { result.h -= 1; }
    }

    h = Math.round(result.h * 360) + '°';
    s = Math.round(result.s * 100) + '%';
    v = Math.round(result.v * 100) + '%';

    result.h = h;
    result.s = s;
    result.v = v;
    result.full = ['hsv(', [h, s, v].join(','), ')'].join('')

    return result;
}

exports.rgbToCmyk = function (rgb) {
    var C = 0,
        M = 0,
        Y = 0,
        K = 0,
        r = parseInt( ('' + rgb.r).replace(/\s/g, ''), 10 ), 
        g = parseInt( ('' + rgb.g).replace(/\s/g, ''), 10 ),
        b = parseInt( ('' + rgb.b).replace(/\s/g, ''), 10 ); 

   
    // BLACK
    if (r === 0 && g === 0 && b === 0) {
     K = 1;
     return [0,0,0,1];
    }
   
    C = 1 - (r/255);
    M = 1 - (g/255);
    Y = 1 - (b/255);
   
    var minCMY = Math.min(C, Math.min(M, Y));
    C = Number((C - minCMY) / (1 - minCMY)).toFixed(4) * 100 + '%' ;
    M = Number((M - minCMY) / (1 - minCMY)).toFixed(4) * 100 + '%' ;
    Y = Number((Y - minCMY) / (1 - minCMY)).toFixed(4) * 100 + '%' ;
    K = minCMY.toFixed(4) * 100 + '%';
    full = ['cmyk(', [C, M, Y, K].join(','), ')'].join('');
   
    return {
        c: C,
        m: M,
        y: Y,
        k: K,
        full: full
   }
}

//TODO

//hslToRgb
//hsvToRgb
//cmykToRgb
//Add HSL type detection
//Add HSV type detection
//Add CMYK type detection