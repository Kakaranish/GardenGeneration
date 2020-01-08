const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;
const TILE_SIZE = 32;

const canvas = document.getElementById('canvas');
canvas.width = 0;
canvas.height = 0;


// ---  A* ALGORITHM  ----------------------------------------------

function heuristic(point, goal) {
    let dx = Math.abs(point.x - goal.x);
    let dy = Math.abs(point.y - goal.y);
    return dx + dy;
}

function getPointNeighbours(map, point) {
    let neighbours = [];
    let tentative_neighbours = [{ "x": point.x, "y": point.y - 1 },
    { "x": point.x + 1, "y": point.y }, { "x": point.x, "y": point.y + 1 },
    { "x": point.x - 1, "y": point.y }]

    tentative_neighbours.forEach(tentative_neighbour => {
        if (tentative_neighbour.x < 1 || tentative_neighbour.x > MAP_WIDTH ||
            tentative_neighbour.y < 1 || tentative_neighbour.y > MAP_HEIGHT) {
            return;
        }
        if (map.tiles[tentative_neighbour.x - 1][tentative_neighbour.y] !== undefined) {
            return;
        }

        neighbours.push(tentative_neighbour);
    });

    return neighbours;
}

function findLowestFScoreInOpenSet(openSet, fScoreArray) {
    let mapped = openSet.map((point) => {
        return {
            "x": point.x,
            "y": point.y,
            "fScore": fScoreArray[point.x - 1][point.y - 1].value
        };
    });

    const min = mapped.reduce(function (prev, current) {
        return (prev.fScore < current.fScore) ? prev : current
    });

    return min;
}

function setCameFromPoint(cameFromArray, point) {
    let foundIndex = cameFromArray.findIndex(function (cameFromPoint) {
        return cameFromPoint.x === point.x && cameFromPoint.y === point.y;
    });
    if (foundIndex === -1) {
        cameFromArray.push(point);
    } else {
        cameFromArray[foundIndex] = point;
    }
}

function removePointFromArray(arr, point){
    let foundIndex = arr.findIndex(function (arrPoint) {
        return arrPoint.x === point.x && arrPoint.y === point.y;
    });
    arr.splice(foundIndex, 1);
}

function isPointInArray(arr, point){
    let foundIndex = arr.findIndex(function (arrPoint) {
        return arrPoint.x === point.x && arrPoint.y === point.y;
    });

    return foundIndex !== -1;
}

function getInitScoreArray(){
    let arr = new Array(this.width)
    for (let i = 0; i < MAP_WIDTH; i++) {
        arr[i] = new Array(MAP_HEIGHT);
        for (let j = 0; j < MAP_HEIGHT; j++) {
            arr[i][j] = {
                "x": i,
                "y": j,
                "value": Infinity
            };
        }
    }
    return arr;
}

function findPath(map, start_point, goal) {
    if (map.tiles[start_point.x - 1][start_point.y - 1] !== undefined) {
        console.log("Find path failure - can't start in " +
            start_point.x + "," + start_point.y + ".");
        return null;
    }
    
    let cameFrom = [];
    let openSet = [start_point];
    let gScore = getInitScoreArray();
    let fScore = getInitScoreArray();
    
    gScore[start_point.x - 1][start_point.y - 1].value = 0;
    fScore[start_point.x - 1][start_point.y - 1] = heuristic(start_point, goal);

    while (openSet.length > 0) {
        let current = findLowestFScoreInOpenSet(openSet, fScore);
        if (current.x == goal.x && current.y == goal.y) {
            cameFrom.push({
                "x": current.x,
                "y": current.y
            });
            return cameFrom;
        }

        removePointFromArray(openSet, current);

        let neighbours = getPointNeighbours(map, current);
        neighbours.forEach(neighbour => {
            let tentative_gScore = gScore[current.x - 1][current.y - 1].value
                + heuristic(current, neighbour);

            if (tentative_gScore < gScore[neighbour.x - 1][neighbour.y - 1].value) {
                if(isPointInArray(cameFrom, current) == false){
                    cameFrom.push({
                        "x": current.x,
                        "y": current.y
                    });
                }
                
                gScore[neighbour.x - 1][neighbour.y - 1].value = tentative_gScore;
                fScore[neighbour.x - 1][neighbour.y - 1].value =
                    tentative_gScore + heuristic(neighbour, goal);

                let isNeighbourInOpenSet = isPointInArray(openSet, neighbour);
                if (isNeighbourInOpenSet === false) {
                    openSet.push(neighbour);
                }
            }
        });
    }

    console.log("Open set is empty - failure.");
    return null;
}

// --- END OF A* ALGORITHM  ---------------------- 


function drawPathFromPointToBridge(map, point) {

}




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
    // let bridge_point = {
    //     "x": map.bridge.x,
    //     "y": map.bridge.y
    // };

    let bridge_point = {
        "x": MAP_WIDTH,
        "y": MAP_HEIGHT
    };
    let path = findPath(map, start_point, bridge_point);
    console.log("----  PATH  ----");
    console.log(path);

    // Generate path (from bottom to bridge)
    // let path_coords = {};
    // console.log(map.bridge);
    // if(map.bridge.isHorizontal()){
    //     path_coords.x = 2;
    //     path_coords.y = 3;
    // }


    // let path_starts_from_left = randomTrueOrFalse();
    // let path_x = path_starts_from_left ? randomInt(3, 6) : map.width - randomInt(3, 6);
    // let path_y = map.height;
    // let x_movement_multiplier = path_starts_from_left ? 1 : -1;

    // let pathTile = new Tile(map, null, TileType.PATH, path_x, path_y);

    // findShortestPath(map);
    map.draw();
}


function findShortestPath(map) {
    let path_starts_from_left = randomTrueOrFalse();
    let path_coords = {
        "x": path_starts_from_left ? randomInt(3, 6) : map.width - randomInt(3, 6),
        "y": map.height
    }

    let bridge_coords = {
        "x": map.bridge.x,
        "y": map.bridge.y
    }

    let currentCoords = {
        "x": map.bridge.x,
        "y": map.bridge.y
    };
    for (let i = 1; i <= 3; i++) {
        let move_offsets = {};

        if (currentCoords.x == 1 || currentCoords.x == map.width ||
            currentCoords.y == 1 || currentCoords.y == map.height) {
            break;
        }

        while (true) {
            let moves_horizontally = randomTrueOrFalse();
            if (moves_horizontally) {
                move_offsets.y = 0;
                let moves_left = randomTrueOrFalse();
                if (moves_left) {
                    move_offsets.x = -1;
                } else {
                    move_offsets.x = 1;
                }
            } else {
                move_offsets.x = 0;
                let moves_up = randomTrueOrFalse();
                if (moves_up) {
                    move_offsets.y = -1;
                } else {
                    move_offsets.y = 1;
                }
            }

            let newCoords = {
                "x": currentCoords.x + move_offsets.x,
                "y": currentCoords.y + move_offsets.y
            }
            // if (map.tiles[newCoords.x - 1][newCoords.y - 1] !== undefined) {
            //     continue;
            // }
            if (PathTile.isPathLegal(map, newCoords.x, newCoords.y) == false) {
                continue;
            }
            currentCoords = newCoords;
            new PathTile(map, null, currentCoords.x, currentCoords.y) //No parent ATM
            break;
        }
    }


    console.log(path_coords);

    let x_movement_multiplier = path_starts_from_left ? 1 : -1;


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
