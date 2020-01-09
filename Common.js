var Direction = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

var TileType = {
    TREE: "img/tree.png",
    ROCK: "img/rock.png",
    WATER: "img/water.png",
    BRIDGE: "img/bridge.png",
    PATH: "img/path.png",
    FLOWER1: "img/flower1.png",
    FLOWER2: "img/flower2.png"
};

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