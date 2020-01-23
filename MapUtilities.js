class MapUtilities {
    static addGeneratedBrookToMap(map, brook) {
        let currentWaterTile = new WaterTile(map, null, brook[0].x, brook[0].y);
        for (let i = 1; i < brook.length; i++) {
            let nextWaterTileDirection = currentWaterTile.getNeighbourDirection(brook[i]);
            let nextTile = currentWaterTile.addNextWaterTile(nextWaterTileDirection);
            currentWaterTile = nextTile !== null ? nextTile : currentWaterTile;
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
            if (map.tiles[floraTile.x - 1][floraTile.y - 1] === undefined) {
                new Tile(map, null, floraTile.floraType, floraTile.x, floraTile.y);
            }
        });
    }
}