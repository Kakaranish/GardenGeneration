
const BREAK_SIZE = 4;
const MIN_DISTANCE_FROM_EDGE = 3;
const MIN_VERTICAL_MOVEMENT = 3;

class MapGenerator {
    static generate(canvas) {
        let map = new Map(canvas, MAP_WIDTH, MAP_HEIGHT);
        let waterTiles = MapGenerator.generateBrook(map);
        waterTiles.forEach(tile => {
            new WaterTile(map, null, tile.x, tile.y);
        });

        let bridge = MapGenerator.generateBridge(map);
        new BridgeTile(map, null, bridge.x, bridge.y);

        let paths = MapGenerator.generatePaths(map);
        paths.forEach(path => {
            for (let i = 0; i < path.length; i++) {
                let tile = path[i];
                if (map.tiles[tile.x - 1][tile.y - 1] !== undefined) {
                    break;
                }
                new PathTile(map, null, tile.x, tile.y);
            }
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
        horizontalMovements.forEach((horizontalMovementLength, horizontalMovementNum) => {
            for (let j = (horizontalMovementNum == 0) ? 2 : 1; j <= horizontalMovementLength; j++) {
                currentPosition = {
                    "x": currentPosition.x + 1,
                    "y": currentPosition.y
                };
                waterTiles.push(currentPosition);
            }

            if (horizontalMovementNum === horizontalMovements.length - 1) {
                return;
            }

            let verticalMovementLength = MapGenerator.randomVerticalMovementLength(
                emptyMap, currentPosition);
            let isMovementUp = verticalMovementLength < 0 ? true : false;
            for (let j = 0; j < Math.abs(verticalMovementLength); j++) {
                currentPosition = {
                    "x": currentPosition.x,
                    "y": currentPosition.y + (isMovementUp ? -1 : 1)
                };
                waterTiles.push(currentPosition);
            }
        });

        return waterTiles;
    }

    static generateBridge(mapWithBrook) {
        let min_x = Math.floor(mapWithBrook.width / 2) - Math.floor(mapWithBrook.width / 4);
        let max_x = Math.floor(mapWithBrook.width / 2) + Math.floor(mapWithBrook.width / 4)

        let matchingWaterTiles = mapWithBrook.waterTiles.flat().filter(tile =>
            tile !== undefined && tile.x >= min_x && tile.x <= max_x);
        if (matchingWaterTiles.length === 0) {
            return null;
        }

        while (true) {
            let randomWaterTileIndex = randomInt(0, matchingWaterTiles.length - 1);
            let randomWaterTile = matchingWaterTiles[randomWaterTileIndex];
            let isBridgeLegal = mapWithBrook.isBridgeLegal(randomWaterTile.x, randomWaterTile.y);
            if (isBridgeLegal) {
                return {
                    "x": randomWaterTile.x,
                    "y": randomWaterTile.y
                };
            }
        }
    }

    static generatePaths(mapWithBrookAndBridge) {
        let map = mapWithBrookAndBridge;
        let pathFinder = new PathFinder(map);
        let fictiousObstaclesAlongBrook = MapGenerator.getFictiousObstaclesAlongBrook(map);
        let pathsStartPoints = MapGenerator.getPathsStartPoints(map);

        let paths = [];

        let largerAreaPaths = [];
        pathsStartPoints.largerArea.forEach(pathStartPoint => {
            let path = pathFinder.findPathToBridge(pathStartPoint,
                fictiousObstaclesAlongBrook, largerAreaPaths);
            paths.push(path);
            largerAreaPaths.push(path);
        });

        let smallerAreaPath = [];
        pathsStartPoints.smallerArea.forEach(pathStartPoint => {
            let path = pathFinder.findPathToBridge(pathStartPoint,
                fictiousObstaclesAlongBrook, smallerAreaPath);
            paths.push(path);
            smallerAreaPath.push(path);
        });

        return paths;
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

    static randomVerticalMovementLength(emptyMap, currentPosition) {
        let maxVerticalMovementLength = 0;
        let isMovementUp = randomTrueOrFalse();
        if (isMovementUp) {
            maxVerticalMovementLength = currentPosition.y - MIN_DISTANCE_FROM_EDGE - 1;
            if (maxVerticalMovementLength < MIN_VERTICAL_MOVEMENT) {
                isMovementUp = false;
                maxVerticalMovementLength = emptyMap.height - currentPosition.y
                    - MIN_DISTANCE_FROM_EDGE;
            }
        } else {
            maxVerticalMovementLength = emptyMap.height
                - currentPosition.y - MIN_DISTANCE_FROM_EDGE;
            if (maxVerticalMovementLength < MIN_VERTICAL_MOVEMENT) {
                isMovementUp = true;
                maxVerticalMovementLength = currentPosition.y - MIN_DISTANCE_FROM_EDGE - 1;
            }
        }

        let verticalMovementPoints = randomInt(MIN_VERTICAL_MOVEMENT,
            Math.abs(maxVerticalMovementLength));
        return isMovementUp
            ? -1 * verticalMovementPoints
            : verticalMovementPoints;
    }

    static getFictiousObstaclesAlongBrook(map) {
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

    static getPathsStartPoints(mapWithBrookAndBridge) {
        let map = mapWithBrookAndBridge;
        let tileCountAboveBrook = map.countTilesAboveBrook();
        let tileCountBelowBrook = map.countTilesBelowBrook();
        let countRatio = tileCountAboveBrook > tileCountBelowBrook
            ? tileCountBelowBrook / tileCountAboveBrook
            : tileCountAboveBrook / tileCountBelowBrook;

        let largerAreaY = tileCountAboveBrook > tileCountBelowBrook ?
            1 : map.height;
        let smallerAreaY = tileCountAboveBrook < tileCountBelowBrook ?
            1 : map.height;

        if (countRatio > 0.8) {
            return {
                "largerArea": [
                    { "x": 1, "y": largerAreaY },
                    { "x": map.width, "y": largerAreaY }
                ],
                "smallerArea": [
                    { "x": 1, "y": smallerAreaY },
                    { "x": map.width, "y": smallerAreaY }
                ]
            };
        }
        else if (countRatio > 0.45 && countRatio <= 0.8) {
            return {
                "largerArea": [
                    { "x": 1, "y": largerAreaY },
                    { "x": map.width, "y": largerAreaY }
                ],
                "smallerArea": [
                    { "x": Math.floor(map.width / 2), "y": smallerAreaY }
                ]
            };
        }
        else if (countRatio <= 0.45) {
            return {
                "largerArea": [
                    { "x": 1, "y": largerAreaY },
                    { "x": map.width, "y": largerAreaY },
                    { "x": Math.floor(map.width / 2), "y": largerAreaY }
                ],
                "smallerArea": [
                    {
                        "x": randomTrueOrFalse() ? 1 : map.width,
                        "y": smallerAreaY
                    }
                ]
            };
        }
    }
}