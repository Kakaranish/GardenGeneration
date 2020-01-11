
const BREAK_SIZE = 4;
const MIN_DISTANCE_FROM_EDGE = 3;
const MIN_VERTICAL_MOVEMENT = 3;

class MapGenerator {

    static generate(canvas) {
        let map = new Map(canvas, MAP_WIDTH, MAP_HEIGHT);
        let waterTiles = MapGenerator.generateBrook(map);
        // console.log(waterTiles);
        waterTiles.forEach(tile => {
            new WaterTile(map, null, tile.x, tile.y);
        });

        map.draw();

    }

    static generateBrook(emptyMap) {
        let startY = randomInt(1 + MIN_DISTANCE_FROM_EDGE,
            emptyMap.height - MIN_DISTANCE_FROM_EDGE);

        let currentPosition = {
            "x": 1,
            "y": startY
        };
        let waterTiles = [currentPosition];

        let horizontalMovements = MapGenerator.randomHorizontalMovementsLenghts(emptyMap);
        horizontalMovements.forEach((horizontalMovementPoints, horizontalMovementNum) => {
            for (let j = (horizontalMovementNum == 0) ? 2 : 1; j <= horizontalMovementPoints; j++) {
                currentPosition = {
                    "x": currentPosition.x + 1,
                    "y": currentPosition.y
                };
                waterTiles.push(currentPosition);
            }

            if (horizontalMovementNum === horizontalMovements.length - 1) {
                return;
            }

            let verticalMovementPoints = MapGenerator.randomVerticalMovement(
                emptyMap, currentPosition);
            let isMovementUp = verticalMovementPoints < 0 ? true : false;
            for (let j = 0; j < Math.abs(verticalMovementPoints); j++) {
                currentPosition = {
                    "x": currentPosition.x,
                    "y": currentPosition.y + (isMovementUp ? -1 : 1)
                };
                waterTiles.push(currentPosition);
            }
        });

        return waterTiles;
    }

    static randomHorizontalMovementsLenghts(emptyMap) {
        let breaksCount = randomInt(4, 7);
        let maxHorizontalMovementLength = Math.floor(emptyMap.width / breaksCount) + 2;
        let remainingMovementPoints = emptyMap.width;
        let horizontalMovements = [];
        for (let i = 1; i <= breaksCount; i++) {
            if (i === breaksCount) {
                horizontalMovements.push(remainingMovementPoints);
                break;
            }

            let excludedMovements = (breaksCount - i) * BREAK_SIZE;
            let movement = 0;
            while (true) {
                movement = randomInt(BREAK_SIZE, maxHorizontalMovementLength);
                if (remainingMovementPoints - movement >= excludedMovements) {
                    break;
                }
            }
            horizontalMovements.push(movement);
            remainingMovementPoints -= movement;
        }
        return horizontalMovements;
    }

    static randomVerticalMovement(emptyMap, currentPosition) {
        let maxVerticalMovementLength = 0;
        let isMovementUp = randomTrueOrFalse();
        if (isMovementUp) {
            maxVerticalMovementLength = currentPosition.y - MIN_DISTANCE_FROM_EDGE;
            if (maxVerticalMovementLength <= 1) {
                isMovementUp = false;
                maxVerticalMovementLength = emptyMap.height
                    - currentPosition.y - MIN_DISTANCE_FROM_EDGE;
            }
        } else {
            maxVerticalMovementLength = emptyMap.height
                - currentPosition.y - MIN_DISTANCE_FROM_EDGE;
            if (maxVerticalMovementLength <= 1) {
                isMovementUp = true;
                maxVerticalMovementLength = currentPosition.y - MIN_DISTANCE_FROM_EDGE;
            }
        }

        let verticalMovementPoints = randomInt(MIN_VERTICAL_MOVEMENT,
            Math.abs(maxVerticalMovementLength));
        return isMovementUp
            ? -1 * verticalMovementPoints
            : verticalMovementPoints;
    }

    generateWaterPath2() {








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
                "higher": [1, map.width],
                "lower": [1, map.width]
            };
        }
        else if (countRatio > 0.45 && countRatio <= 0.8) {
            pathsNum = {
                "higher": [1, map.width],
                "lower": [Math.floor(map.width / 2)]
            };
        }
        else if (countRatio <= 0.45) {
            pathsNum = {
                "higher": [1, map.width, Math.floor(map.width / 2)],
                "lower": [map.width]
            };
        }

        // Draw higher
        startPoint.y = countAboveIsGreater ? 1 : map.height;
        pathsNum.higher.forEach(x => {
            startPoint.x = x;
            path = pathFinder.findPathToBridge(startPoint, fictiousObstacles);
            path.forEach(tile => {
                new PathTile(map, null, tile.x, tile.y);
            });
        });

        startPoint.y = countAboveIsGreater ? map.height : 1;
        pathsNum.lower.forEach(x => {
            startPoint.x = x;
            path = pathFinder.findPathToBridge(startPoint, fictiousObstacles);
            path.forEach(tile => {
                new PathTile(map, null, tile.x, tile.y);
            });
        });

        map.draw();
    }

    getFictiousObstaclesAlongBrook(map) {
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

    countTilesAboveBrook(map) {
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

    countTilesBelowBrook(map) {
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

    pathFindingTest() {
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
}