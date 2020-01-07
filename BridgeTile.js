class BridgeTile extends Tile {
    constructor(map, parent, x, y) {
        super(map, parent, TileType.BRIDGE, x, y);
        let other_tile = this.map.tiles[x - 1][y - 1]; // ?????
        this.childs.push(other_tile);
        this.map.bridge = this;
    }

    static isBridgeLegal(map, x, y) {
        let tile_type = map.getTileType(x, y);
        let tile_type_above = map.getTileType(x, y - 1);
        let tile_type_on_right = map.getTileType(x + 1, y);
        let tile_type_below = map.getTileType(x, y + 1);
        let tile_type_on_left = map.getTileType(x - 1, y);

        if (tile_type == null) {
            return false;
        }
        if ((tile_type_above && tile_type_on_right) || (tile_type_on_right && tile_type_below)
            || (tile_type_below && tile_type_on_left) || (tile_type_on_left && tile_type_above)) {
            return false;
        }
        return true;
    }

    isHorizontal() {
        let tile_type_above = this.map.getTileType(this.x, this.y - 1);
        let tile_type_below = this.map.getTileType(this.x, this.y + 1);
        if (tile_type_above && tile_type_below) {
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