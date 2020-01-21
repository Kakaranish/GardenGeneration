class MapUtilities {


    static crossMaps(map1, map2, canvasForCrossProduct) {
        let firstIsLeft = randomTrueOrFalse();
        let leftMap = firstIsLeft
            ? map1
            : map2;
        let rightMap = firstIsLeft
            ? map2
            : map1;

        let crossResult = new Map(canvasForCrossProduct, MAP_WIDTH, MAP_HEIGHT);

        let brook = this.glueBrooks(map1.waterTiles, map2.waterTiles, MAP_WIDTH);
        brook.forEach(tile => {
            new WaterTile(crossResult, null, tile.x, tile.y);
        });

        let bridge = MapGenerator.generateBridge(crossResult); //always at map center
        MapGenerator.addGeneratedBridgeToMap(crossResult, bridge);

        let paths = MapGenerator.generatePaths(crossResult);
        MapGenerator.addGeneratedPathsToMap(crossResult, paths);


        let leftFlora = MapUtilities.getFloraFromLeftHalfOfMap(leftMap);
        leftFlora.forEach(floraTile => {
            if (crossResult.tiles[floraTile.x - 1][floraTile.y - 1] === undefined) {
                new Tile(crossResult, null, floraTile.tileType,
                    floraTile.x, floraTile.y)
            }
        });

        let rightFlora = MapUtilities.getFloraFromRightHalfOfMap(rightMap);
        rightFlora.forEach(floraTile => {
            if (crossResult.tiles[floraTile.x - 1][floraTile.y - 1] === undefined) {
                new Tile(crossResult, null, floraTile.tileType,
                    floraTile.x, floraTile.y)
            }
        });

        // Take 10% of derieved flora and randomize it

        return crossResult;
    }

    static glueBrooks(leftBrook, rightBrook, mapWidth = MAP_WIDTH) {
        let last5WaterTiles = null;
        let lastTile = null;

        let leftBrookHalf = MapUtilities.getLeftHalfOfTheBrook(
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

        let rightBrookHalf = MapUtilities.getRightHalfOfTheBrook(
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

        let leftBrookEndPoint = leftBrookHalf.slice(-1)[0];
        let rightBrookEndPoint = rightBrookHalf.slice(-1)[0];
        for (let x = leftBrookEndPoint.x; x <= rightBrookEndPoint.x; x++) {
            if (x === rightBrookEndPoint.x &&
                leftBrookEndPoint.y === rightBrookEndPoint.y) {
                rightBrookHalf.reverse();
                return leftBrookHalf.concat(rightBrookHalf);
            }
            leftBrookHalf.push({
                "x": x,
                "y": leftBrookEndPoint.y
            });
        }

        leftBrookEndPoint = leftBrookHalf.slice(-1)[0];
        if (leftBrookEndPoint.y <= rightBrookEndPoint.y) {
            for (let y = leftBrookEndPoint.y; y < rightBrookEndPoint.y; y++) {
                leftBrookHalf.push({
                    "x": leftBrookEndPoint.x,
                    "y": y
                });
            }
        }
        else {
            for (let y = leftBrookEndPoint.y; y > rightBrookEndPoint.y; y--) {
                leftBrookHalf.push({
                    "x": leftBrookEndPoint.x,
                    "y": y
                });
            }
        }

        rightBrookHalf.reverse();
        return leftBrookHalf.concat(rightBrookHalf);
    }

    static getFloraFromLeftHalfOfMap(map) {
        let centerIndex = Math.ceil(map.width / 2.);
        return map.tiles.flat().filter(tile =>
            tile !== undefined && tile.isFloraType() && tile.x <= centerIndex);
    }

    static getFloraFromRightHalfOfMap(map) {
        let centerIndex = Math.ceil(map.width / 2.);
        return map.tiles.flat().filter(tile =>
            tile !== undefined && tile.isFloraType() && tile.x > centerIndex);
    }

    static getLeftHalfOfTheBrook(brook, mapWidth) {
        let centerIndex = Math.ceil(mapWidth / 2.);
        return brook.filter(waterTile => waterTile.x < centerIndex)
    }

    static getRightHalfOfTheBrook(brook, mapWidth) {
        let centerIndex = Math.ceil(mapWidth / 2.);
        return brook.filter(waterTile => waterTile.x > centerIndex)
    }
}