const MAP_WIDTH = 30;
const MAP_HEIGHT = 21;
const TILE_SIZE = 16;

// const canvas = document.getElementById('canvas');

let canvasCounter = 0;

function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.style.border = "1px solid";
    canvas.width = 0;
    canvas.height = 0;
    var body = document.getElementById("canvas_container");
    body.appendChild(canvas);

    canvasCounter++;
    return canvas;
}

let canvas1 = createCanvas();
let map1 = MapGenerator.generate(canvas1);
map1.draw();

let canvas2 = createCanvas();
let map2 = MapGenerator.generate(canvas2);
map2.draw();

let crossResultCanvas = createCanvas();
let crossResult = MapCrosser.crossMaps(map1, map2, crossResultCanvas);
crossResult.draw();

// MapEvaluator.evaluateMapScore(map)