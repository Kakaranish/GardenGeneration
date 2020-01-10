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
        let childCoords = {
            "x": this.x,
            "y": this.y
        };

        switch (direction) {
            case Direction.LEFT:
                childCoords.x--;
                break;
            case Direction.RIGHT:
                childCoords.x++;
                break;
            case Direction.UP:
                childCoords.y--;
                break;
            case Direction.DOWN:
                childCoords.y++;
                break;
        }

        return childCoords;
    }

    

    addChild(tileType, direction) {
        if (this.childs.some(child => child.direction === direction)) {
            console.log("Two childs can't have same direction");
            return null;
        }

        let childCoords = this.getChildCoords(direction);
        if (this.map.tiles[childCoords.x - 1][childCoords.y - 1] !== undefined) {
            console.log("Tile on " + childCoords.x + "," + childCoords.y + " already exists.");
            return null;
        }

        let child = new Tile(this.map, this, tileType, childCoords.x, childCoords.y);
        return child;
    }

    // hasChildOn(direction){
    //     let childCoords = this.getChildCoords(direction);
    //     let childX = childCoords[0];
    //     let childY = childCoords[1];
    //     return this.childs.some(child => child.x === childX && child.y === childY);
    // }

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