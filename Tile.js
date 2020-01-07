class Tile {
    constructor(map, parent, tileType, x, y) {
        this.map = map;
        this.parent = parent;
        this.tileType = tileType;
        this.x = x;
        this.y = y;
        this.childs = [];

        this.map.tiles[x - 1][y - 1] = this;
    }

    getChildCoords(direction) {
        let child_x = this.x;
        let child_y = this.y;

        switch (direction) {
            case Direction.LEFT:
                child_x--;
                break;
            case Direction.RIGHT:
                child_x++;
                break;
            case Direction.UP:
                child_y--;
                break;
            case Direction.DOWN:
                child_y++;
                break;
        }

        return [child_x, child_y];
    }

    addChild(tileType, direction) {
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

        let child = new Tile(this.map, this, tileType, child_x, child_y);
        return child;
    }

    draw() {
        const image = new Image(TILE_SIZE, TILE_SIZE);
        image.onload = drawImageActualSize;
        image.src = this.tileType;

        let canvas_x = (this.x - 1) * TILE_SIZE;
        let canvas_y = (this.y - 1) * TILE_SIZE;
        let local_context = this.map.context;
        function drawImageActualSize() {
            local_context.drawImage(this, canvas_x, canvas_y, this.width, this.height);
        }
    }
}