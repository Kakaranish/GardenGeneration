class WaterTile extends Tile {
    constructor(map, parent, x, y) {
        super(map, parent, TileType.WATER, x, y);
    }

    addNextWaterTile(direction) {
        if (this.childs.some(child => child.direction === direction)) {
            console.log("Two childs can't have same direction");
            return null;
        }

        let child_coords = this.getChildCoords(direction);
        let child_x = child_coords[0];
        let child_y = child_coords[1];

        if (this.map.tiles[child_x - 1][child_y - 1] !== undefined) {
            console.log("Tile on " + child_x + "," + child_y + " already exists.");
            return null;
        }

        let isLegal = true;
        if (direction === Direction.UP) {
            let tile_type_above = this.map.getTileType(child_x, child_y - 1);
            let tile_type_on_left = this.map.getTileType(child_x - 1, child_y);
            let tile_type_on_right = this.map.getTileType(child_x + 1, child_y);
            if (tile_type_above || tile_type_on_left || tile_type_on_right) {
                isLegal = false;
            }
        }
        else if (direction === Direction.DOWN) {
            let tile_type_below = this.map.getTileType(child_x, child_y + 1);
            let tile_type_on_left = this.map.getTileType(child_x - 1, child_y);
            let tile_type_on_right = this.map.getTileType(child_x + 1, child_y);
            if (tile_type_below || tile_type_on_left || tile_type_on_right) {
                isLegal = false;
            }
        }
        else if (direction === Direction.LEFT) {
            let tile_type_above = this.map.getTileType(child_x, child_y - 1);
            let tile_type_below = this.map.getTileType(child_x, child_y + 1);
            let tile_type_on_left = this.map.getTileType(child_x - 1, child_y);
            if (tile_type_below || tile_type_above || tile_type_on_left) {
                isLegal = false;
            }
        }
        else if (direction === Direction.RIGHT) {
            let tile_type_above = this.map.getTileType(child_x, child_y - 1);
            let tile_type_below = this.map.getTileType(child_x, child_y + 1);
            let tile_type_on_right = this.map.getTileType(child_x + 1, child_y);
            if (tile_type_below || tile_type_above || tile_type_on_right) {
                isLegal = false;
            }
        }

        if (isLegal == false) {
            console.log("Illegal water path.");
            return null;
        }

        let child = new WaterTile(this.map, this, child_x, child_y);
        return child;
    }
}