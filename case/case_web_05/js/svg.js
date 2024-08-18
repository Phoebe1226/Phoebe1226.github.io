/* 
 * Lazy Line Painter - Path Object 
 * Generated using 'SVG to Lazy Line Converter'
 * 
 * http://lazylinepainter.info 
 * Copyright 2013, Cam O'Connell  
 *  
 */ 
var pathObj = {
    "logo": {
        "strokepath": [
            {
                "path": "M    28.561,1.5 1.5,1.5 1.5,64.793 57.883,64.793 57.883,1.5 28.815,1.5  L   28.561,1.5 1.5,1.5 1.5,64.793 57.883,64.793 57.883,1.5 28.815,1.5  ",
                "duration": 1300
            },
            {
                "path": "M    57.883,30.843 37.396,19.575 37.396,43.512 57.883,32.244  L   57.883,30.843 37.396,19.575 37.396,43.512 57.883,32.244  ",
                "duration": 900
            },
            {
                "path": "M    57.883,64.05 37.396,52.782 37.396,64.793 57.883,64.793  L   57.883,64.05 37.396,52.782 37.396,64.793 57.883,64.793  ",
                "duration": 700
            }
        ],
        "dimensions": {
            "width": 60,
            "height": 67
        }
    }
}; 
 
/* 
 Setup and Paint your lazyline! 
 */ 
 $(document).ready(function(){ 
 $('#logo').lazylinepainter( 
 {
    "svgData": pathObj,
    "strokeWidth": 2,
    "strokeColor": "#1a1a1a"
}).lazylinepainter('paint'); 
 });