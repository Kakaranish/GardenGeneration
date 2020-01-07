class PathTile extends Tile{
    constructor(map, parent, x, y) {
        super(map, parent, TileType.PATH, x, y);
        this.map.pathTiles.push(this);
    }

    static isPathLegal(map, x, y) {
        let tile_type = map.getTileType(x, y);
        let tile_type_above = map.getTileType(x, y - 1);
        let tile_type_on_right = map.getTileType(x + 1, y);
        let tile_type_below = map.getTileType(x, y + 1);
        let tile_type_on_left = map.getTileType(x - 1, y);

        if (tile_type) {
            return false;
        }
        if ((tile_type_above && tile_type_on_right) || (tile_type_on_right && tile_type_below)
            || (tile_type_below && tile_type_on_left) || (tile_type_on_left && tile_type_above)) {
            return false;
        }
        return true;
    }
}