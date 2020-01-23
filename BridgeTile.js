class BridgeTile extends Tile {
    constructor(map, x, y) {
        super(map, TileType.BRIDGE, x, y);
        this.map.bridge = this;
    }

    isHorizontal() {
        let tile_type_above = this.map.getTileType(this.x, this.y - 1);
        let tile_type_below = this.map.getTileType(this.x, this.y + 1);
        if (tile_type_above === TileType.WATER
            && tile_type_below === TileType.WATER) {
            return false;
        }
        return true;
    }

    draw() {
        const image = new Image(TILE_SIZE, TILE_SIZE);
        image.onload = drawImageActualSize;
        image.src = this.tileType;

        let canvas_x = (this.x - 1) * TILE_SIZE;
        let canvas_y = (this.y - 1) * TILE_SIZE;
        let isHorizontal = this.isHorizontal();
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