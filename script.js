
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const TILE_SIZE = 32;

const canvas = document.getElementById('canvas');
canvas.width = 0;
canvas.height = 0;


function generateWaterPath() {
    const break_size = 3;
    let init_y = Math.floor(Math.random() * MAP_WIDTH) + 1;
    let breaks_num = Math.floor(Math.random() * 5) + 2;
    let max_movement = Math.floor(MAP_WIDTH / breaks_num) + 2;

    let remaining_movement = MAP_WIDTH;
    let horizontal_movements = [];

    console.log("Breaks num = " + breaks_num);
    console.log("Max movement = " + max_movement);
    for (let i = 1; i <= breaks_num; i++) {
        if (i == breaks_num) {
            horizontal_movements.push(remaining_movement);
            break;
        }

        let reserved_movements_capacity = (breaks_num - i) * break_size;
        let movement = 0;
        do {
            movement = Math.floor(Math.random() * (max_movement - break_size))
                + break_size;
        } while (remaining_movement - movement < reserved_movements_capacity);
        horizontal_movements.push(movement);
        remaining_movement -= movement;
    }

    console.log(horizontal_movements);

    let rootTile = new Tile(null, 1, init_y);
    let prevTile = rootTile;

    for (let i = 0; i < horizontal_movements.length; i++) {
        let movements_num = horizontal_movements[i];
        let j = i == 0 ? 2 : 1;
        for (j; j <= movements_num; j++) {
            let newTile = null;
            do {
                newTile = prevTile.addChild(TileType.WATER, Direction.RIGHT);
            } while (newTile == null);
            prevTile = newTile;
        }

        let isMovementUp = Math.round(Math.random());
        let maxYMovement = 0;
        if (isMovementUp) {
            maxYMovement = prevTile.y - 1;
            if (maxYMovement < 1) {
                isMovementUp = false;
                maxYMovement = MAP_WIDTH - prevTile.y;
            }
        } else {
            maxYMovement = MAP_WIDTH - prevTile.y;
            if (maxYMovement < 1) {
                isMovementUp = true;
                maxYMovement = prevTile.y - 1;
            }
        }

        let movements = Math.floor(Math.random() * (maxYMovement - 1)) + 1;
        for (let j = 0; j < movements; j++) {
            let movementDirection = isMovementUp ? Direction.UP : Direction.DOWN;
            prevTile = prevTile.addChild(TileType.WATER, movementDirection);
        }
    }
}

function initSampleMap() {

    let map = new Map(canvas, MAP_WIDTH, MAP_HEIGHT);
    map.draw();

    let rootTile = new WaterTile(map, null, 1, 7);
    rootTile.addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.DOWN)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.RIGHT)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.UP)
        .addNextWaterTile(Direction.RIGHT);



    let waterTile1 = map.tiles[8 - 1][6 - 1];
    let tree1 = waterTile1.addChild(TileType.TREE, Direction.UP);
    tree1.addChild(TileType.TREE, Direction.LEFT).addChild(TileType.TREE, Direction.DOWN);
    tree1.addChild(TileType.TREE, Direction.BRIDGE);
    let waterTile2 = map.tiles[5 - 1][9 - 1];
    let bridgeTile = new BridgeTile(map, null, 5, 8, false);
    map.draw();
}



function generateFlora() {
    let populateAbove = getRandomTrueOrFalse();
    let populateBelow = getRandomTrueOrFalse();

    if (populateAbove) {

    }

    if (populateBelow) {

    }
}

// generateWaterPath();
// drawTiles();
// showGrid();


// let map = new Map(canvas, 25, 20);
// map.draw();
initSampleMap();
