const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;
const TILE_SIZE = 32;

const canvas = document.getElementById('canvas');
canvas.width = 0;
canvas.height = 0;


function generateWaterPath() {
    let init_y = Math.floor(Math.random() * (MAP_HEIGHT - 2 * MIN_DISTANCE_FROM_EDGE)) + (1 + MIN_DISTANCE_FROM_EDGE);
    let breaks_num = Math.floor(Math.random() * 3) + 4;
    let max_movement = Math.floor(MAP_WIDTH / breaks_num) + 2;

    let remaining_movement = MAP_WIDTH;
    let horizontal_movements = [];

    for (let i = 1; i <= breaks_num; i++) {
        if (i == breaks_num) {
            horizontal_movements.push(remaining_movement);
            break;
        }

        let reserved_movements_capacity = (breaks_num - i) * BREAK_SIZE;
        let movement = 0;
        do {
            movement = Math.floor(Math.random() * (max_movement - BREAK_SIZE))
                + BREAK_SIZE;
        } while (remaining_movement - movement < reserved_movements_capacity);
        horizontal_movements.push(movement);
        remaining_movement -= movement;
    }

    let map = new Map(canvas, MAP_WIDTH, MAP_HEIGHT);
    let rootTile = new WaterTile(map, null, 1, init_y);
    let prevTile = rootTile;


    for (let i = 0; i < horizontal_movements.length; i++) {
        let movements_num = horizontal_movements[i];

        // Generate water tiles in x axis
        for (let j = (i == 0) ? 2 : 1; j <= movements_num; j++) {
            let newTile = null;
            do {
                newTile = prevTile.addNextWaterTile(Direction.RIGHT);
            } while (newTile == null);
            prevTile = newTile;
        }

        let maxYMovement = 0;
        let isMovementUp = randomTrueOrFalse();
        if (isMovementUp) {
            maxYMovement = prevTile.y - MIN_DISTANCE_FROM_EDGE;
            if (maxYMovement <= 1) {
                isMovementUp = false;
                maxYMovement = MAP_HEIGHT - prevTile.y - MIN_DISTANCE_FROM_EDGE;
            }
        } else {
            maxYMovement = MAP_HEIGHT - prevTile.y - MIN_DISTANCE_FROM_EDGE;
            if (maxYMovement <= 1) {
                isMovementUp = true;
                maxYMovement = prevTile.y - MIN_DISTANCE_FROM_EDGE;
            }
        }

        // Generate water tiles in y axis
        let movements = Math.floor(Math.random() * (maxYMovement - 1)) + 1;
        for (let j = 0; j < movements; j++) {
            let movementDirection = isMovementUp ? Direction.UP : Direction.DOWN;
            prevTile = prevTile.addNextWaterTile(movementDirection);
        }
    }
    // return;
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


    let pathFinder = new PathFinder(map);
    let startPoint = {};
    let path = null;
    let fictiousObstacles = getFictiousObstaclesAlongBrook(map);

    let tilesAboveBrookCount = countTilesAboveBrook(map);
    let tilesBelowBrookCount = countTilesBelowBrook(map);
    let countAboveIsGreater = tilesAboveBrookCount > tilesBelowBrookCount;
    let countRatio = countAboveIsGreater
        ? tilesBelowBrookCount / tilesAboveBrookCount
        : tilesAboveBrookCount / tilesBelowBrookCount;

        
    console.log("Count ratio = " + countRatio);
    let pathsNum = {};
    if (countRatio > 0.8) {
        pathsNum = {
            "top": [ 1, map.width],
            "bottom": [ 1, map.width]
        };
    }
    else if (countRatio > 0.45 && countRatio <= 0.8) {
        pathsNum = {
            "top": [ 1, map.width],
            "bottom": [ Math.floor(map.width / 2)]
        };
    }
    else if (countRatio <= 0.45) {
        pathsNum = {
            "top": [ 1, map.width, Math.floor(map.width / 2)],
            "bottom": [ map.width ]
        };
    }

    // Draw top
    startPoint.y = countAboveIsGreater ? 1 : map.height;
    pathsNum.top.forEach(x => {
        startPoint.x = x;
        path = pathFinder.findPathToBridge(startPoint, fictiousObstacles);
        path.forEach(tile => {
            new PathTile(map, null, tile.x, tile.y);
        });
    });

    startPoint.y = countAboveIsGreater ? map.height : 1;
    pathsNum.bottom.forEach(x => {
        startPoint.x = x;
        path = pathFinder.findPathToBridge(startPoint, fictiousObstacles);
        path.forEach(tile => {
            new PathTile(map, null, tile.x, tile.y);
        });
    });

    map.draw();
}

function getFictiousObstaclesAlongBrook(map) {
    let waterTiles = map.waterTiles.flat().filter(val => val !== undefined);
    let directions = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
    let fictiousObstacles = [];

    waterTiles.forEach(tile => {
        directions.forEach(direction => {
            if (tile.isInRelationWithOtherTile(direction, TileType.WATER) === false) {
                let fictiousObstacle = tile.getChildCoords(direction);
                if (map.isPointLegal(fictiousObstacle)) {
                    fictiousObstacles.push(fictiousObstacle);
                }
            }
        });
    });

    let bridge = {
        "x": map.bridge.x,
        "y": map.bridge.y
    };
    console.log(bridge);

    let filteredFictiousObstacles = fictiousObstacles.filter(obstacle =>
        (obstacle.x < bridge.x - 2) || (obstacle.x > bridge.x + 2) || (obstacle.y < bridge.y - 2) || (obstacle.y > bridge.y + 2)
    );
    return filteredFictiousObstacles;
}

function countTilesAboveBrook(map) {
    let totalEmptyTilesCount = 0;
    for (let col = 0; col < map.width; col++) {
        let firstWaterTileIndex = map.tiles[col].findIndex(tile => {
            return tile !== undefined && (tile.tileType === TileType.WATER
                || tile.tileType === TileType.BRIDGE);
        });

        let emptyTilesCount = firstWaterTileIndex -
            map.tiles[col].filter(function (value, index) {
                return value.tileType !== undefined && index < firstWaterTileIndex;
            }).length;
        totalEmptyTilesCount += emptyTilesCount;
    }

    return totalEmptyTilesCount;
}

function countTilesBelowBrook(map) {
    let totalEmptyTilesCount = 0;
    for (let col = 0; col < map.width; col++) {
        let firstWaterTileIndex = map.tiles[col].findIndex(tile => {
            return tile !== undefined && (tile.tileType === TileType.WATER
                || tile.tileType === TileType.BRIDGE);
        });
        let waterTilesCount = map.tiles[col].reduce((count, value) => {
            return count + (value.tileType === TileType.WATER);
        }, 0);
        let lastWaterTileIndex = firstWaterTileIndex + waterTilesCount;

        let nonEmptyTilesCount = map.tiles[col].reduce((count, value, index) => {
            return count + (value !== undefined && index > lastWaterTileIndex);
        }, 0);
        let emptyTilesCount = map.tiles[col].length - lastWaterTileIndex - nonEmptyTilesCount;
        totalEmptyTilesCount += emptyTilesCount;
    }
    return totalEmptyTilesCount;
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
// generateWaterPath();
MapGenerator.generate(canvas);
// pathFindingTest();
