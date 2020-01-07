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
    FLOWER1: "img/flower1.png",
    FLOWER2: "img/flower2.png"
};

function getRandomTrueOrFalse() {
    let value = Math.round(Math.random());
    return value ? true : false;
}