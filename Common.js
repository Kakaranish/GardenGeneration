var Direction = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

var TileType = {
    WATER: "img/water.png",
    BRIDGE: "img/bridge.png",
    PATH: "img/path.png",
    TREE: "img/tree.png",
    ROCK: "img/rock.png",
    FLOWER1: "img/flower1.png",
    FLOWER2: "img/flower2.png"
};

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
})

function randomTrueOrFalse() {
    let value = Math.round(Math.random());
    return value ? true : false;
}

function randomInt(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

function get2dArray(width, height, defaultValue) {
    let arr = new Array(width)
    for (let i = 0; i < width; i++) {
        arr[i] = new Array(height);
        for (let j = 0; j < height; j++) {
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}

function removePointFromArray(arr, point) {
    let foundIndex = arr.findIndex(arrPoint => {
        return arrPoint.x === point.x && arrPoint.y === point.y;
    });
    if (foundIndex !== -1) {
        arr.splice(foundIndex, 1);
    }
}

function randomFloraType(randomSet = undefined) {
    if (randomSet === undefined) {
        randomSet = [
            TileType.ROCK,
            TileType.TREE,
            TileType.FLOWER1,
            TileType.FLOWER2
        ];
    }
    let randomIndex = randomInt(0, randomSet.length - 1);
    return randomSet[randomIndex];
}

function clearCanvasContainer()
{
    document.getElementById("canvas_container").innerHTML = "";
}

function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.style.border = "1px solid";
    canvas.width = 0;
    canvas.height = 0;
    var body = document.getElementById("canvas_container");
    body.appendChild(canvas);

    return canvas;
}
