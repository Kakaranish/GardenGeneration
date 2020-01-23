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
        try {
            // MapGenerator.addGeneratedBrookToMap(crossResult, brook);
            brook.forEach(waterTile => {
                new WaterTile(crossResult, null, waterTile.x, waterTile.y);
            });
            // new PathTile(crossResult, null, 16, 1);
            let bridge = MapGenerator.generateBridge(crossResult);  // Always at center of the map
            MapGenerator.addGeneratedBridgeToMap(crossResult, bridge);

            let paths = MapGenerator.generatePaths(crossResult);
            MapGenerator.addGeneratedPathsToMap(crossResult, paths);
        } catch (error) {
            alert("ERROR");
            console.log("left");
            console.log(leftMap);
            console.log("right");
            console.log(rightMap);
            console.log(brook);
            throw new Error("Something went badly wrong!");
        }
        // let flora = MapCrosser.crossFlora(leftMap, rightMap);
        // MapGenerator.addGeneratedFloraToMap(crossResult, flora);

        return crossResult;
    }

    static crossBrooks(leftBrook, rightBrook) {
        let last5WaterTiles = null;
        let lastTile = null;
        let mapCenter = {
            "x": Math.round(MAP_WIDTH / 2),
            "y": Math.round(MAP_HEIGHT / 2)
        };

        let randomFactor = randomInt(1, 10);
        if (randomFactor === 5) { // Any number
            let leftIsChoosen = randomTrueOrFalse();
            if (leftIsChoosen) {
                leftBrook = MapGenerator.generateBrook();
            }
            else {
                rightBrook = MapGenerator.generateBrook();
            }

        }
        let leftBrookHalf = MapCrosser.getBrookFromLeftHalfOfMap(leftBrook);
        last5WaterTiles = leftBrookHalf.slice(-5);
        lastTile = leftBrookHalf.slice(-1)[0];

        leftBrookHalf.reverse();
        let tileIndex = 0;
        while (leftBrookHalf[tileIndex].x >= mapCenter.x - 3) {
            tileIndex++;
        }
        leftBrookHalf = leftBrookHalf.slice(tileIndex);
        leftBrookHalf.reverse();
        // if (last5WaterTiles.every(tile => tile.y === lastTile.y) === false) {


        //     while (leftBrookHalf[tileIndex].y === lastTile.y) {
        //         tileIndex++;
        //     }


        // }

        let rightBrookHalf = MapCrosser.getBrookFromRightHalfOfMap(rightBrook);
        last5WaterTiles = rightBrookHalf.slice(-5);
        tileIndex = 1;
        lastTile = rightBrookHalf[0];

        lastTile = rightBrookHalf[tileIndex - 1];
        while (rightBrookHalf[tileIndex].x <= mapCenter.x + 3) {
            tileIndex++;
        }

        lastTile = rightBrookHalf[tileIndex - 1];
        while (rightBrookHalf[tileIndex].x === lastTile.x) {
            tileIndex++;
        }
        tileIndex--;
        rightBrookHalf = rightBrookHalf.slice(tileIndex);

        // if (last5WaterTiles.every(tile => tile.y === lastTile.y) === false) {
        //     let tileIndex = 1;
        //     while (rightBrookHalf[tileIndex].y === lastTile.y) {
        //         tileIndex++;
        //     }

        // }

        let resultBrook = [].concat(leftBrookHalf);
        let leftBrookEndPoint = leftBrookHalf[leftBrookHalf.length - 1];
        let rightBrookEndPoint = rightBrookHalf[0];
        for (let x = leftBrookEndPoint.x + 1; x <= rightBrookEndPoint.x; x++) {
            resultBrook.push({
                "x": x,
                "y": leftBrookEndPoint.y
            });
        }

        let resultBrookEndPoint = resultBrook[resultBrook.length - 1];
        if (resultBrookEndPoint.y < rightBrookEndPoint.y) {
            for (let y = resultBrookEndPoint.y + 1; y < rightBrookEndPoint.y; y++) {
                resultBrook.push({
                    "x": resultBrookEndPoint.x,
                    "y": y
                });
            }
        }
        else if (resultBrookEndPoint.y > rightBrookEndPoint.y) {
            for (let y = resultBrookEndPoint.y - 1; y > rightBrookEndPoint.y; y--) {
                resultBrook.push({
                    "x": resultBrookEndPoint.x,
                    "y": y
                });
            }
        }

        resultBrookEndPoint = resultBrook[resultBrook.length - 1];
        rightBrookEndPoint = rightBrookHalf[0];
        if (resultBrookEndPoint.x === rightBrookEndPoint.x &&
            resultBrookEndPoint.y === rightBrookEndPoint.y) {
            rightBrookHalf = rightBrookHalf.slice(1);
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

    static getBrookFromLeftHalfOfMap(brook) {
        let centerIndex = Math.round(MAP_WIDTH / 2);
        return brook.filter(waterTile => waterTile.x < centerIndex)
    }

    static getBrookFromRightHalfOfMap(brook) {
        let centerIndex = Math.round(MAP_WIDTH / 2);
        return brook.filter(waterTile => waterTile.x > centerIndex);
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
        for (let i = 1; i <= toDistortCount + 2; i++) {
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