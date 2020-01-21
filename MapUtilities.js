class MapUtilities {
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

        if (leftBrookEndPoint.y < rightBrookEndPoint.y) {
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

    static getLeftHalfOfTheBrook(brook, mapWidth) {
        let centerIndex = Math.ceil(mapWidth / 2.);
        return brook.filter(waterTile => waterTile.x < centerIndex)
    }

    static getRightHalfOfTheBrook(brook, mapWidth) {
        let centerIndex = Math.ceil(mapWidth / 2.);
        return brook.filter(waterTile => waterTile.x > centerIndex)
    }
}