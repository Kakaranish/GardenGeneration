class BridgeTile extends Tile {
    constructor(map, parent, x, y, isHorizontal = false) {
        let other_tile = map.tiles[x - 1][y - 1];
        if (other_tile === undefined || other_tile.tileType != TileType.WATER) {

        }
        super(map, parent, TileType.BRIDGE, x, y);
        this.isHorizontal = isHorizontal;
    }

    draw() {
        const image = new Image(TILE_SIZE, TILE_SIZE);
        image.onload = drawImageActualSize;
        image.src = this.tileType;

        let canvas_x = (this.x - 1) * TILE_SIZE;
        let canvas_y = (this.y - 1) * TILE_SIZE;
        let isHorizontal = this.isHorizontal;
        let local_context = this.map.context;
        function drawImageActualSize() {
            if (isHorizontal === false) {
                local_context.save();
                local_context.translate(canvas_x + TILE_SIZE / 2, canvas_y + TILE_SIZE / 2);
                local_context.rotate(90 * Math.PI / 180);
                local_context.drawImage(this, -TILE_SIZE / 2, -TILE_SIZE / 2, this.width, this.height);
                local_context.restore();
            }
            else {
                local_context.drawImage(this, canvas_x, canvas_y, this.width, this.height);
            }
        }
    }
}