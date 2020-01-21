const MAP_WIDTH = 30;
const MAP_HEIGHT = 21;
const TILE_SIZE = 16;

// const canvas = document.getElementById('canvas');

let canvasCounter = 0;

function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.id = "xD" + (Math.random()).toString();
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

// console.log(map1.waterTiles);
// console.log(map2.waterTiles);

console.log(map1.waterTiles2);

let connectedBrook = MapUtilities.glueBrooks(map1.waterTiles2, map2.waterTiles2, MAP_WIDTH);
let canvas3 = createCanvas();
let map3 = new Map(canvas3, MAP_WIDTH, MAP_HEIGHT);;
connectedBrook.forEach(tile => {
    new WaterTile(map3, null, tile.x, tile.y);
});
map3.draw();






// MapEvaluator.evaluateMapScore(map)