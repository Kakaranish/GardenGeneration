const BREAK_SIZE = 4;
const MIN_DISTANCE_FROM_EDGE = 3;
const MIN_VERTICAL_MOVEMENT = 3;

class MapGenerator {
    static generate() {
        let map = new Map();
        
        let brook = MapGenerator.generateBrook(map);
        MapGenerator.addGeneratedBrookToMap(map, brook);

        let bridge = MapGenerator.generateBridge(map);
        MapGenerator.addGeneratedBridgeToMap(map, bridge);

        let paths = MapGenerator.generatePaths(map);
        MapGenerator.addGeneratedPathsToMap(map, paths);
        
        let flora = MapGenerator.generateFlora(map);
        MapGenerator.addGeneratedFloraToMap(map, flora);

        return map;
    }

    static generateBrook(emptyMap) {
        let map = emptyMap;
        let startY = randomInt(1 + MIN_DISTANCE_FROM_EDGE,
            MAP_HEIGHT - MIN_DISTANCE_FROM_EDGE);

        let currentPosition = {
            "x": 1,
            "y": startY
        };
        let waterTiles = [currentPosition];

        let horizontalMovements = MapGenerator.randomHorizontalMovementsLenghts(map);
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
                map, currentPosition);
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
        let map = mapWithBrook;
        let min_x = Math.floor(MAP_WIDTH / 2);
        let max_x = Math.floor(MAP_WIDTH / 2);

        let matchingWaterTiles = map.waterTiles.flat().filter(tile =>
            tile !== undefined && tile.x >= min_x && tile.x <= max_x);
        if (matchingWaterTiles.length === 0) {
            return null;
        }

        while (true) {
            let randomWaterTileIndex = randomInt(0, matchingWaterTiles.length - 1);
            let randomWaterTile = matchingWaterTiles[randomWaterTileIndex];
            let isBridgeLegal = map.isBridgeLegal(randomWaterTile.x, randomWaterTile.y);
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
        let fictiousObstaclesAlongBrook = MapGenerator.getTilesSurroundingBrook(map);
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

    static generateFlora(map) {
        let randomSet = [
            TileType.ROCK,
            TileType.TREE, TileType.TREE, TileType.TREE,
            TileType.FLOWER1, TileType.FLOWER1,
            TileType.FLOWER2, TileType.FLOWER2
        ];
        let emptyTilesCount = map.getEmptyTilesCount();
        let floraToRandomCount = randomInt(
            Math.floor(emptyTilesCount / 2) - Math.floor(emptyTilesCount / 4),
            Math.floor(emptyTilesCount / 2) + Math.floor(emptyTilesCount / 4));
        let flora = [];
        for (let i = 1; i <= floraToRandomCount; i++) {
            while (true) {
                let randomTileCoords = {
                    "x": randomInt(1, MAP_WIDTH),
                    "y": randomInt(1, MAP_HEIGHT)
                };
                if (map.getTileType(randomTileCoords.x, randomTileCoords.y) === null) {
                    let floraType = randomFloraType(randomSet);
                    randomTileCoords.floraType = floraType;
                    flora.push(randomTileCoords);
                    break;
                }
            }
        }
        return flora;
    }

    static addGeneratedBrookToMap(map, brook) {
        let currentWaterTile = new WaterTile(map, null, brook[0].x, brook[0].y);
        for (let i = 1; i < brook.length; i++) {
            let nextWaterTileDirection = currentWaterTile.getNeighbourDirection(brook[i]);
            currentWaterTile = currentWaterTile.addNextWaterTile(nextWaterTileDirection);
        }
    }

    static addGeneratedBridgeToMap(map, bridge) {
        new BridgeTile(map, null, bridge.x, bridge.y);
    }

    static addGeneratedPathsToMap(map, paths) {
        paths.forEach(path => {
            let currentPathTile = new PathTile(map, null, path[0].x, path[0].y);

            for (let i = 1; i < path.length; i++) {
                let nextTileCoords = path[i];
                let nextTileDirection = currentPathTile.getNeighbourDirection(nextTileCoords);
                let nextPathTileTileType = map.getTileType(nextTileCoords.x, nextTileCoords.y);
                if (nextPathTileTileType === TileType.PATH ||
                    nextPathTileTileType === TileType.BRIDGE) {
                    let nextTile = map.tiles[nextTileCoords.x - 1][nextTileCoords.y - 1];
                    currentPathTile.childs.push(nextTile);
                    break;
                }

                currentPathTile = currentPathTile.addChild(TileType.PATH, nextTileDirection);
            }
        });
    }

    static addGeneratedFloraToMap(map, flora) {
        flora.forEach(floraTile => {
            if(map.tiles[floraTile.x - 1][floraTile.y - 1] === undefined)
            {
                new Tile(map, null, floraTile.floraType, floraTile.x, floraTile.y);
            }
        })
    }

    static randomHorizontalMovementsLenghts(emptyMap) {
        let map = emptyMap;
        let breaksCount = randomInt(4, 7);
        let maxHorizontalMovementLength = Math.floor(MAP_WIDTH / breaksCount) + 2;
        let remainingMovementPoints = MAP_WIDTH;
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
        let map = emptyMap;
        let maxVerticalMovementLength = 0;
        let isMovementUp = randomTrueOrFalse();
        if (isMovementUp) {
            maxVerticalMovementLength = currentPosition.y - MIN_DISTANCE_FROM_EDGE - 1;
            if (maxVerticalMovementLength < MIN_VERTICAL_MOVEMENT) {
                isMovementUp = false;
                maxVerticalMovementLength = MAP_HEIGHT - currentPosition.y
                    - MIN_DISTANCE_FROM_EDGE;
            }
        } else {
            maxVerticalMovementLength = MAP_HEIGHT
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

    static getTilesSurroundingBrook(map, filterAroundBridge = true) {
        let waterTiles = map.waterTiles;
        let directions = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
        let surroundingTiles = [];

        waterTiles.forEach(tile => {
            directions.forEach(direction => {
                if (tile.isInRelationWithOtherTile(direction, TileType.WATER) === false) {
                    let surroundingTile = tile.getChildCoords(direction);
                    if (map.isPointLegal(surroundingTile)) {
                        surroundingTiles.push(surroundingTile);
                    }
                }
            });
        });

        if (filterAroundBridge) {
            let bridge = {
                "x": map.bridge.x,
                "y": map.bridge.y
            };
            return surroundingTiles.filter(obstacle =>
                (obstacle.x < bridge.x - 2) || (obstacle.x > bridge.x + 2) || (obstacle.y < bridge.y - 2) || (obstacle.y > bridge.y + 2)
            );
        }
        return surroundingTiles;
    }

    static getPathsStartPoints(mapWithBrookAndBridge) {
        let map = mapWithBrookAndBridge;
        let tileCountAboveBrook = map.countTilesAboveBrook();
        let tileCountBelowBrook = map.countTilesBelowBrook();
        let countRatio = tileCountAboveBrook > tileCountBelowBrook
            ? tileCountBelowBrook / tileCountAboveBrook
            : tileCountAboveBrook / tileCountBelowBrook;

        let largerAreaY = tileCountAboveBrook > tileCountBelowBrook ?
            1 : MAP_HEIGHT;
        let smallerAreaY = tileCountAboveBrook < tileCountBelowBrook ?
            1 : MAP_HEIGHT;

        if (countRatio > 0.8) {
            return {
                "largerArea": [
                    { "x": 1, "y": largerAreaY },
                    { "x": MAP_WIDTH, "y": largerAreaY }
                ],
                "smallerArea": [
                    { "x": 1, "y": smallerAreaY },
                    { "x": MAP_WIDTH, "y": smallerAreaY }
                ]
            };
        }
        else if (countRatio > 0.45 && countRatio <= 0.8) {
            return {
                "largerArea": [
                    { "x": 1, "y": largerAreaY },
                    { "x": MAP_WIDTH, "y": largerAreaY }
                ],
                "smallerArea": [
                    { "x": Math.floor(MAP_WIDTH / 2), "y": smallerAreaY }
                ]
            };
        }
        else if (countRatio <= 0.45) {
            return {
                "largerArea": [
                    { "x": 1, "y": largerAreaY },
                    { "x": MAP_WIDTH, "y": largerAreaY },
                    { "x": Math.floor(MAP_WIDTH / 2), "y": largerAreaY }
                ],
                "smallerArea": [
                    {
                        "x": randomTrueOrFalse() ? 1 : MAP_WIDTH,
                        "y": smallerAreaY
                    }
                ]
            };
        }
    }
}