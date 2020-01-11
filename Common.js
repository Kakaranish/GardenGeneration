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

function randomFloraType(){
    let randomIndex = randomInt(1, 4);
    switch(randomIndex){
        case 1:
            return TileType.TREE;
        case 2:
            return TileType.ROCK;
        case 3:
            return TileType.FLOWER1;
        case 4:
            return TileType.FLOWER2;
    }
}