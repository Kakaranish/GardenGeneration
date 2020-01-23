class PathTile extends Tile{
    constructor(map, x, y) {
        super(map, TileType.PATH, x, y);
        this.map.pathTiles.push(this);
    }
}