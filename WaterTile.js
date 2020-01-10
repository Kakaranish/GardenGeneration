class WaterTile extends Tile {
    constructor(map, parent, x, y) {
        super(map, parent, TileType.WATER, x, y);

        this.map.waterTiles[x - 1][y - 1] = this;
    }

    addNextWaterTile(direction) {
        if (this.childs.some(child => child.direction === direction)) {
            console.log("Two childs can't have same direction");
            return null;
        }

        let childCoords = this.getChildCoords(direction);
        if (this.map.tiles[childCoords.x - 1][childCoords.y - 1] !== undefined) {
            console.log("Tile on " + childCoords.x + "," + childCoords.y + " already exists.");
            return null;
        }

        let isLegal = true;
        if (direction === Direction.UP) {
            let tile_type_above = this.map.getTileType(childCoords.x, childCoords.y - 1);
            let tile_type_on_left = this.map.getTileType(childCoords.x - 1, childCoords.y);
            let tile_type_on_right = this.map.getTileType(childCoords.x + 1, childCoords.y);
            if (tile_type_above || tile_type_on_left || tile_type_on_right) {
                isLegal = false;
            }
        }
        else if (direction === Direction.DOWN) {
            let tile_type_below = this.map.getTileType(childCoords.x, childCoords.y + 1);
            let tile_type_on_left = this.map.getTileType(childCoords.x - 1, childCoords.y);
            let tile_type_on_right = this.map.getTileType(childCoords.x + 1, childCoords.y);
            if (tile_type_below || tile_type_on_left || tile_type_on_right) {
                isLegal = false;
            }
        }
        else if (direction === Direction.LEFT) {
            let tile_type_above = this.map.getTileType(childCoords.x, childCoords.y - 1);
            let tile_type_below = this.map.getTileType(childCoords.x, childCoords.y + 1);
            let tile_type_on_left = this.map.getTileType(childCoords.x - 1, childCoords.y);
            if (tile_type_below || tile_type_above || tile_type_on_left) {
                isLegal = false;
            }
        }
        else if (direction === Direction.RIGHT) {
            let tile_type_above = this.map.getTileType(childCoords.x, childCoords.y - 1);
            let tile_type_below = this.map.getTileType(childCoords.x, childCoords.y + 1);
            let tile_type_on_right = this.map.getTileType(childCoords.x + 1, childCoords.y);
            if (tile_type_below || tile_type_above || tile_type_on_right) {
                isLegal = false;
            }
        }

        if (isLegal == false) {
            console.log("Illegal water path.");
            return null;
        }

        let child = new WaterTile(this.map, this, childCoords.x, childCoords.y);
        this.childs.push(child);
        return child;
    }
}