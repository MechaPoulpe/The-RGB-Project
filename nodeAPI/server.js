var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var morgan = require('morgan');
var utils = require('./utils.js');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

function sendResponse (res, object) {
    if (typeof object === 'object' && object.hasOwnProperty('error'))
        res.json({error: object.error})

    res.json(object)
}


router.use(function(req, res, next) {
    // do logging
	next();
});

// -> /getAll   params: hex or rgb
router.route('/getAll')
	.get(function(req, res) {
        var colors = utils.setRGBHEX(req.query.color),
            hex = colors.hex,
            rgb = colors.rgb,
            hsl = null,
            hsv = null,
            cmyk = null,
            err = colors.err;

        if (err) {
            sendResponse(res, { error: err });
        } else {
            hsl = utils.rgbToHsl(rgb);
            hsv = utils.rgbToHsv(rgb);
            cmyk = utils.rgbToCmyk(rgb);

            sendResponse(res, {
                hex: hex,
                rgb: rgb,
                hsl: hsl,
                hsv: hsv,
                cmyk: cmyk
            })
        }
    })

// -> /getHex params: hex or rgb
router.route('/getHex')
    .get(function(req, res) {
        var colors = utils.setRGBHEX(req.query.color),
            hex = colors.hex,
            err = colors.err;

        if (err) {
            sendResponse(res, { error: err });
        } else {
            sendResponse(res, {
                hex: hex
            })
        }
    })
    
// -> /getRgb params: hex or rgb
router.route('/getRgb')
    .get(function(req, res) {
        var colors = utils.setRGBHEX(req.query.color),
            rgb = colors.rgb,
            err = colors.err;

        if (err) {
            sendResponse(res, { error: err });
        } else {
            sendResponse(res, {
                rgb: rgb
            })
        }
    })
   
// -> /getHsl params: hex or rgb
router.route('/getHsl')
    .get(function(req, res) {
        var colors = utils.setRGBHEX(req.query.color),
            rgb = colors.rgb,
            err = colors.err,
            hsl;

        if (err) {
            sendResponse(res, { error: err });
        } else {
            hsl = utils.rgbToHsl(rgb);
            sendResponse(res, {
                hsl: hsl
            })
        }
    })
 
// -> /getHsv params: hex or rgb
router.route('/getHsv')
    .get(function(req, res) {
        var colors = utils.setRGBHEX(req.query.color),
            rgb = colors.rgb,
            err = colors.err,
            hsv;

        if (err) {
            sendResponse(res, { error: err });
        } else {
            hsv = utils.rgbToHsv(rgb);
            sendResponse(res, {
                hsv: hsv
            })
        }
    })

// -> /getCmyk params: hex or rgb
router.route('/getCmyk')
.get(function(req, res) {
    var colors = utils.setRGBHEX(req.query.color),
        rgb = colors.rgb,
        err = colors.err,
        cmyk;

    if (err) {
        sendResponse(res, { error: err });
    } else {
        cmyk = utils.rgbToCmyk(rgb);
        sendResponse(res, {
            cmyk: cmyk
        })
    }
})
 



app.use('/api', router);
app.listen(port);

console.log('API on ' + port);


//API METHOD

//getAll (color) : return all format color code
//getHex (color) : return HEX color code
//getRgb (color) : return RGB color code
//getHsl (color) : return HSL color code
//getHsv (color) : return HSV color code
//getCmyk (color) : return CMYK color code
