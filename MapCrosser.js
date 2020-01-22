class MapCrosser {
    static crossMaps(map1, map2) {
        let firstIsLeft = randomTrueOrFalse();
        let leftMap = firstIsLeft
            ? map1
            : map2;
        let rightMap = firstIsLeft
            ? map2
            : map1;

        let crossResult = new Map();

        let brook = MapCrosser.crossBrooks(leftMap.waterTiles, rightMap.waterTiles, MAP_WIDTH);
        MapGenerator.addGeneratedBrookToMap(crossResult, brook);

        let bridge = MapGenerator.generateBridge(crossResult);  // Always at center of the map
        MapGenerator.addGeneratedBridgeToMap(crossResult, bridge);

        let paths = MapGenerator.generatePaths(crossResult);
        MapGenerator.addGeneratedPathsToMap(crossResult, paths);

        let flora = MapCrosser.crossFlora(leftMap, rightMap);
        MapGenerator.addGeneratedFloraToMap(crossResult, flora);

        return crossResult;
    }

    static crossBrooks(leftBrook, rightBrook, mapWidth = MAP_WIDTH) {
        let last5WaterTiles = null;
        let lastTile = null;

        let leftBrookHalf = MapCrosser.getBrookFromLeftHalfOfMap(
            leftBrook, mapWidth);
        last5WaterTiles = leftBrookHalf.slice(-5);
        lastTile = leftBrookHalf.slice(-1)[0];

        if (last5WaterTiles.every(tile => tile.y === lastTile.y) === false) {
            let reversedLeftBrookHalf = [].concat(leftBrookHalf).reverse();

            let tileIndex = 0;
            while (reversedLeftBrookHalf[tileIndex].y === lastTile.y) {
                tileIndex++;
            }
            lastTile = reversedLeftBrookHalf[tileIndex - 1];
            while (reversedLeftBrookHalf[tileIndex].x === lastTile.x) {
                tileIndex++;
            }

            reversedLeftBrookHalf = reversedLeftBrookHalf.slice(tileIndex);
            leftBrookHalf = [].concat(reversedLeftBrookHalf).reverse();
        }

        let rightBrookHalf = MapCrosser.getBrookFromRightHalfOfMap(
            rightBrook, mapWidth);
        rightBrookHalf.reverse();
        last5WaterTiles = rightBrookHalf.slice(-5);
        lastTile = rightBrookHalf.slice(-1)[0];

        if (last5WaterTiles.every(tile => tile.y === lastTile.y) === false) {
            var reversedRightBrookHalf = [].concat(rightBrookHalf).reverse();

            let tileIndex = 0;
            while (reversedRightBrookHalf[tileIndex].y === lastTile.y) {
                tileIndex++;
            }
            lastTile = reversedRightBrookHalf[tileIndex - 1];
            while (reversedRightBrookHalf[tileIndex].x === lastTile.x) {
                tileIndex++;
            }

            reversedRightBrookHalf = reversedRightBrookHalf.slice(tileIndex);
            rightBrookHalf = [].concat(reversedRightBrookHalf).reverse();
        }

        let resultBrook = [].concat(leftBrookHalf);

        let leftBrookEndPoint = resultBrook.slice(-1)[0];
        let rightBrookEndPoint = rightBrookHalf.slice(-1)[0];
        for (let x = leftBrookEndPoint.x + 1; x <= rightBrookEndPoint.x; x++) {
            resultBrook.push({
                "x": x,
                "y": leftBrookEndPoint.y
            });
        }

        leftBrookEndPoint = resultBrook.slice(-1)[0];
        if (leftBrookEndPoint.y < rightBrookEndPoint.y) {
            for (let y = leftBrookEndPoint.y + 1; y < rightBrookEndPoint.y; y++) {
                resultBrook.push({
                    "x": leftBrookEndPoint.x,
                    "y": y
                });
            }
        }
        else if (leftBrookEndPoint.y > rightBrookEndPoint.y) {
            for (let y = leftBrookEndPoint.y - 1; y > rightBrookEndPoint.y; y--) {
                resultBrook.push({
                    "x": leftBrookEndPoint.x,
                    "y": y
                });
            }
        }

        leftBrookEndPoint = resultBrook.slice(-1)[0];
        rightBrookHalf.reverse();

        if (leftBrookEndPoint.y === rightBrookEndPoint.y) {
            resultBrook.pop()
        }

        resultBrook = resultBrook.concat(rightBrookHalf);
        return resultBrook.map(waterTile => {
            return {
                "x": waterTile.x,
                "y": waterTile.y
            };
        });
    }

    static crossFlora(leftMap, rightMap) {
        let leftFlora = MapCrosser.getDistortedFloraFromLeftPartOfMap(leftMap);
        let rightFlora = MapCrosser.getDistortedFloraFromRightPartOfMap(rightMap);
        return leftFlora.concat(rightFlora);
    }

    static getBrookFromLeftHalfOfMap(brook, mapWidth) {
        let centerIndex = Math.ceil(mapWidth / 2.);
        return brook.filter(waterTile => waterTile.x < centerIndex)
    }

    static getBrookFromRightHalfOfMap(brook, mapWidth) {
        let centerIndex = Math.ceil(mapWidth / 2.);
        return brook.filter(waterTile => waterTile.x > centerIndex)
    }

    static getDistortedFloraFromLeftPartOfMap(leftMap) {
        const percentageToDistort = 10.;
        let floraTiles = MapCrosser.getFloraFromLeftHalfOfMap(leftMap);
        floraTiles = floraTiles.map(floraTile => {
            return {
                "x": floraTile.x,
                "y": floraTile.y,
                "floraType": floraTile.tileType
            }
        });
        
        let toDistortCount = Math.ceil(floraTiles.length / percentageToDistort);
        for (let i = 1; i <= toDistortCount; i++) {
            let indexToRemove = randomInt(0, floraTiles.length - 1);
            floraTiles.splice(indexToRemove, 1);
        }

        let centerIndex = Math.ceil(MAP_WIDTH / 2.);
        for (let i = 1; i <= toDistortCount; i++) {
            let tile = null;
            let randomTileCoords = null;
            while (tile !== undefined) {
                randomTileCoords = {
                    "x": randomInt(1, centerIndex),
                    "y": randomInt(1, MAP_HEIGHT)
                }
                tile = leftMap.tiles[randomTileCoords.x - 1][randomTileCoords.y - 1];
            }
            floraTiles.push({
                "x": randomTileCoords.x,
                "y": randomTileCoords.y,
                "floraType": randomFloraType()
            });
        }
        return floraTiles;
    }

    static getDistortedFloraFromRightPartOfMap(rightMap) {
        const percentageToDistort = 10.;
        let floraTiles = MapCrosser.getFloraFromRightHalfOfMap(rightMap);
        floraTiles = floraTiles.map(floraTile => {
            return {
                "x": floraTile.x,
                "y": floraTile.y,
                "floraType": floraTile.tileType
            }
        });
        let toDistortCount = Math.ceil(floraTiles.length / percentageToDistort);

        for (let i = 1; i <= toDistortCount; i++) {
            let indexToRemove = randomInt(0, floraTiles.length - 1);
            floraTiles.splice(indexToRemove, 1);
        }

        let centerIndex = Math.ceil(MAP_WIDTH / 2.);
        for (let i = 1; i <= toDistortCount; i++) {
            let tile = null;
            let randomTileCoords = null;
            while (tile !== undefined) {
                randomTileCoords = {
                    "x": randomInt(centerIndex + 1, MAP_WIDTH),
                    "y": randomInt(1, MAP_HEIGHT)
                }
                tile = rightMap.tiles[randomTileCoords.x - 1][randomTileCoords.y - 1];
            }
            floraTiles.push({
                "x": randomTileCoords.x,
                "y": randomTileCoords.y,
                "floraType": randomFloraType()
            });
        }

        return floraTiles;
    }

    static getFloraFromLeftHalfOfMap(map) {
        let centerIndex = Math.ceil(MAP_WIDTH / 2.);
        let floraTiles = map.tiles.flat().filter(tile =>
            tile !== undefined && tile.isFloraType() && tile.x <= centerIndex);
        return floraTiles.map(floraTile => {
            return {
                "x": floraTile.x,
                "y": floraTile.y,
                "tileType": floraTile.tileType
            };
        });
    }

    static getFloraFromRightHalfOfMap(map) {
        let centerIndex = Math.ceil(MAP_WIDTH / 2.);
        let floraTiles = map.tiles.flat().filter(tile =>
            tile !== undefined && tile.isFloraType() && tile.x > centerIndex);
        return floraTiles.map(floraTile => {
            return {
                "x": floraTile.x,
                "y": floraTile.y,
                "tileType": floraTile.tileType
            };
        });
    }
}