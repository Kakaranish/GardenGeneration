class MapUtilities {
    static addGeneratedBrookToMap(map, brook) {
        brook.forEach(waterTile => {
            new WaterTile(map, waterTile.x, waterTile.y);
        });
    }

    static addGeneratedBridgeToMap(map, bridge) {
        new BridgeTile(map, bridge.x, bridge.y);
    }

    static addGeneratedPathsToMap(map, paths) {
        paths.forEach(path => {
            path.forEach(pathTile => {
                new PathTile(map, pathTile.x, pathTile.y);
            });
        });
    }

    static addGeneratedFloraToMap(map, flora) {
        flora.forEach(floraTile => {
            if (map.tiles[floraTile.x - 1][floraTile.y - 1] === undefined) {
                new Tile(map, floraTile.floraType, floraTile.x, floraTile.y);
            }
        });
    }
}