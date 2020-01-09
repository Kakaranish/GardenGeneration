const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;
const TILE_SIZE = 32;

const canvas = document.getElementById('canvas');
canvas.width = 0;
canvas.height = 0;

function generateWaterPath() {
    const break_size = 3;
    let init_y = Math.floor(Math.random() * (MAP_HEIGHT - 6)) + 3;
    let breaks_num = Math.floor(Math.random() * 5) + 2;
    let max_movement = Math.floor(MAP_WIDTH / breaks_num) + 2;

    let remaining_movement = MAP_WIDTH;
    let horizontal_movements = [];

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

    let map = new Map(canvas, MAP_WIDTH, MAP_HEIGHT);
    let rootTile = new WaterTile(map, null, 1, init_y);
    let prevTile = rootTile;

    for (let i = 0; i < horizontal_movements.length; i++) {
        let movements_num = horizontal_movements[i];
        let j = i == 0 ? 2 : 1;
        // Generate water tiles in x axis
        for (j; j <= movements_num; j++) {
            let newTile = null;
            do {
                newTile = prevTile.addNextWaterTile(Direction.RIGHT);
            } while (newTile == null);
            prevTile = newTile;
        }

        let isMovementUp = Math.round(Math.random());
        let maxYMovement = 0;
        if (isMovementUp) {
            maxYMovement = prevTile.y - 3;
            if (maxYMovement < 1) {
                isMovementUp = false;
                maxYMovement = MAP_HEIGHT - prevTile.y - 2;
            }
        } else {
            maxYMovement = MAP_HEIGHT - prevTile.y - 2;
            if (maxYMovement < 1) {
                isMovementUp = true;
                maxYMovement = prevTile.y - 3;
            }
        }

        // Generate water tiles in y axis
        let movements = Math.floor(Math.random() * (maxYMovement - 1)) + 1;
        for (let j = 0; j < movements; j++) {
            let movementDirection = isMovementUp ? Direction.UP : Direction.DOWN;
            prevTile = prevTile.addNextWaterTile(movementDirection);
        }
    }

    // Generate bridge
    let water_tiles_intervals = {
        "x_interval": {
            "left": Math.floor(map.width / 2) - Math.floor(map.width / 4),
            "right": Math.floor(map.width / 2) + Math.floor(map.width / 4)
        }
    }

    let matching_water_tiles = map.waterTiles.flat().filter(function (tile) {
        return tile.x >= water_tiles_intervals.x_interval.left &&
            tile.x <= water_tiles_intervals.x_interval.right;
    });

    let bridge_is_legal = false;
    while (true) {
        let random_matching_water_tile = matching_water_tiles[
            randomInt(0, matching_water_tiles.length - 1)];
        bridge_is_legal = BridgeTile.isBridgeLegal(map, random_matching_water_tile.x,
            random_matching_water_tile.y);
        if (bridge_is_legal) {
            let bridgeTile = new BridgeTile(map, null, random_matching_water_tile.x,
                random_matching_water_tile.y);
            break;
        }
    }

    let start_point = {
        "x": 1,
        "y": MAP_HEIGHT
    };

    let pathFinder = new PathFinder(map);
    let path = pathFinder.findPathToBridge(start_point);
    // console.log(path);
    path.forEach(tile => {
        new PathTile(map, null, tile.x, tile.y);
    });

    map.draw();
}


function pathFindingTest() {
    let map = new Map(canvas, MAP_WIDTH, MAP_HEIGHT);
    let pathFinder = new PathFinder(map);


    let start_point = { "x": 1, "y": map.height };
    let end_point = { "x": 13, "y": 8 };

    new WaterTile(map, null, 13, 9);

    new WaterTile(map, null, 11, 13);

    for (let i = 4; i <= 17; i++) {
        new WaterTile(map, null, i, 18);
    }


    let path = pathFinder.findPath(start_point, end_point);
    // console.log(path);
    path.forEach(tile => {
        new PathTile(map, null, tile.x, tile.y);
    });
    new Tile(map, null, TileType.TREE, end_point.x, end_point.y);
    map.draw();
}


function initSampleMap() {
    let map = new Map(canvas, MAP_WIDTH, MAP_HEIGHT);

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

    let bridge_x = 3;
    let bridge_y = 13;
    if (BridgeTile.isBridgeLegal(map, bridge_x, bridge_y)) {
        let bridgeTile = new BridgeTile(map, null, bridge_x, bridge_y);
    }
    console.log(map.tiles);
    map.draw();
}

function generateFlora() {
    let populateAbove = randomTrueOrFalse();
    let populateBelow = randomTrueOrFalse();

    if (populateAbove) {

    }

    if (populateBelow) {

    }
}

// initSampleMap();
generateWaterPath();
// pathFindingTest();
