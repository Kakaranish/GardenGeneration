const BrookDistancePriority = 3;
const CoverageAlongBrookPriority = 2;
const FloraSquaresPriority = 1.5;

class MapEvaluator {
    static showPriorities() {
        console.log("Brook distance priority: " + BrookDistancePriority);
        console.log("Coverage along brook priority: " + CoverageAlongBrookPriority);
        console.log("Flora squares priority: " + FloraSquaresPriority);
    }

    static evaluateMapScore(map) {
        // Priority:
        // 1. Smallest total distance from water
        // 2. Flora squares
        // 3. Coverage along brook

        // Smaller => better [80,200]
        const maxBrookDistanceFromCenter = 200;
        let totalDistanceFromHorizontalCenter
            = MapEvaluator.evaluateTotalBrookDistanceFromHorizontalCentralAxis(map);
        let distanceFactor = BrookDistancePriority *
            (1 - (totalDistanceFromHorizontalCenter / maxBrookDistanceFromCenter));

        // Higher => better - [0,1]
        let coverageAlongBrook = MapEvaluator.evaluateCoverageAlongBrook(map);
        let coverageAlongBrookFactor = CoverageAlongBrookPriority * coverageAlongBrook;

        // Higher => better - [0,40]
        const maxFloraSquaresValue = 40;
        let floraSquares = MapEvaluator.evaluateFloraSquares(map);
        let floraFactor = FloraSquaresPriority * (floraSquares / maxFloraSquaresValue);

        let totalScore = distanceFactor + floraFactor + coverageAlongBrookFactor;
        return totalScore;
    }

    static evaluateCoverageAlongBrook(map) {
        let tilesAlongBrook = MapGenerator.getTilesSurroundingBrook(
            map, false);
        let tilesAlongBrookCount = tilesAlongBrook.length;

        let floraTilesCount = 0;
        tilesAlongBrook.forEach(tileCoords => {
            let tile = map.tiles[tileCoords.x - 1][tileCoords.y - 1];
            if (tile === undefined) {
                return;
            }

            if (tile.tileType === TileType.FLOWER1 ||
                tile.tileType === TileType.FLOWER2 ||
                tile.tileType === TileType.TREE) {
                floraTilesCount++;
            }
        });

        let ratio = floraTilesCount / tilesAlongBrookCount;
        return ratio;
    }

    static evaluateTotalBrookDistanceFromHorizontalCentralAxis(map) {
        let totalDistance = 0;
        for (let col = 0; col < MAP_WIDTH; col++) {
            let waterTilesInCol = map.tiles[col].filter(tile => tile !== undefined
                && (tile.tileType === TileType.WATER ||
                    tile.tileType === TileType.BRIDGE));

            if (waterTilesInCol.length === 1) {
                let tile = waterTilesInCol.shift();
                totalDistance += MapEvaluator.getTileDistanceFromHorizontalCentralAxis(map, tile);
                continue;
            }

            let firstWaterTileIndex = MapEvaluator.getFirstWaterTileIndexInCol(map, col);
            let lastWaterTileIndex = MapEvaluator.getLastWaterTileIndexInCol(map, col);
            let firstWaterTileCoords = {
                "x": "ANY",
                "y": firstWaterTileIndex
            };
            let lastWaterTileCoords = {
                "x": "ANY",
                "y": lastWaterTileIndex
            };
            let firstWaterTileDistance = MapEvaluator.getTileDistanceFromHorizontalCentralAxis(
                map, firstWaterTileCoords);
            let lastWaterTileDistance = MapEvaluator.getTileDistanceFromHorizontalCentralAxis(
                map, lastWaterTileCoords);

            let minDistance = Math.max(firstWaterTileDistance, lastWaterTileDistance);
            totalDistance += minDistance;
        }

        return totalDistance;
    }

    static evaluateNonEmptyTilesFactor(map) {
        let totalTilesCount = MAP_WIDTH * MAP_HEIGHT;
        let nonEmptyTilesCount = map.tiles.flat().reduce((count, value) => {
            return count + (value.tileType !== undefined);
        }, 0);
        return nonEmptyTilesCount / totalTilesCount;
    }

    static evaluateFloraSquares(map) {
        let floraSquaresCount = 0;
        let tile = undefined;
        for (let x = 0; x < MAP_WIDTH - 1; x++) {
            for (let y = 0; y < MAP_HEIGHT - 1; y++) {
                tile = map.tiles[x][y];
                if (tile === undefined || tile.isFloraType() === false) continue;
                tile = map.tiles[x + 1][y];
                if (tile === undefined || tile.isFloraType() === false) continue;
                tile = map.tiles[x][y + 1];
                if (tile === undefined || tile.isFloraType() === false) continue;
                tile = map.tiles[x + 1][y + 1];
                if (tile === undefined || tile.isFloraType() === false) continue;

                floraSquaresCount++;
            }
        }
        return floraSquaresCount;
    }

    static getTileDistanceFromHorizontalCentralAxis(map, tileCoords) {
        let middleIndex = MAP_HEIGHT / 2;
        if (middleIndex % 1 != 0) // Checking if is not integer
        {
            middleIndex = Math.ceil(middleIndex);
            return Math.abs(tileCoords.y - middleIndex);
        }
        else {
            let distance1 = Math.abs(tileCoords.y - middleIndex);
            let distance2 = Math.abs(tileCoords.y - (middleIndex + 1));
            return Math.min(distance1, distance2);
        }
    }

    static getWaterTilesCountInCol(map, col) {
        let waterTilesCount = map.tiles[col].reduce((count, value) => {
            return count + (value.tileType === TileType.WATER ||
                value.tileType === TileType.BRIDGE);
        }, 0);

        return waterTilesCount;
    }

    static getFirstWaterTileIndexInCol(map, col) {
        let firstWaterTileIndex = map.tiles[col].findIndex(tile => {
            return tile !== undefined && (tile.tileType === TileType.WATER
                || tile.tileType === TileType.BRIDGE);
        });
        return firstWaterTileIndex;
    }

    static getLastWaterTileIndexInCol(map, col) {
        let firstWaterTileIndex = MapEvaluator.getFirstWaterTileIndexInCol(map, col);
        if (firstWaterTileIndex === -1) {
            return firstWaterTileIndex;
        }
        let waterTilesCount = MapEvaluator.getWaterTilesCountInCol(map, col);
        if (waterTilesCount === 1) {
            return firstWaterTileIndex;
        }
        let lastWaterTileIndex = firstWaterTileIndex + waterTilesCount;
        return lastWaterTileIndex;
    }
}