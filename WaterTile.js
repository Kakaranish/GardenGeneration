class WaterTile extends Tile {
    constructor(map, x, y) {
        super(map, TileType.WATER, x, y);

        this.map.waterTiles.push(this);
    }
}