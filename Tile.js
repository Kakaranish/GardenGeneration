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

    hasChildInDirection(direction, childTileType = undefined) {
        let childCoordsInDirection = this.getChildCoords(direction);
        let childsInDirection = this.childs.filter(child =>
            child.x === childCoordsInDirection.x && child.y === childCoordsInDirection.y);

        if (childsInDirection.length === 0) {
            return false;
        }
        if (childTileType === undefined) {
            return true;
        }
        let childInDirection = childsInDirection[0];
        return childInDirection.tileType === childTileType;
    }

    isInRelationWithOtherTile(direction, childTileType = undefined) {
        let childCoordsInDirection = this.getChildCoords(direction);
        if (this.parent && this.parent.x === childCoordsInDirection.x
            && this.parent.y === childCoordsInDirection.y) {
            if (childTileType === undefined) {
                return true;
            }
            else {
                return this.parent.tileType === childTileType;
            }
        }
        let childsInDirection = this.childs.filter(child =>
            child.x === childCoordsInDirection.x && child.y === childCoordsInDirection.y);

        if (childsInDirection.length === 0) {
            return false;
        }
        if (childTileType === undefined) {
            return true;
        }
        let childInDirection = childsInDirection[0];
        return childInDirection.tileType === childTileType;
    }

    getNeighbourDirection(neighbourCoords) {
        let diff = {
            "x": neighbourCoords.x - this.x,
            "y": neighbourCoords.y - this.y
        };
        let absDiff = {
            "x": Math.abs(diff.x),
            "y": Math.abs(diff.y)
        }
        if (new Set([0, 1]).has(absDiff.x) === false ||
            new Set([0, 1]).has(absDiff.y) === false) {
            return null;
        }

        if (absDiff.x === 1 && absDiff.y === 1) {
            return null;
        }

        if (diff.x === -1) {
            return Direction.LEFT;
        }
        else if (diff.x === 1) {
            return Direction.RIGHT;
        }
        else if (diff.y === -1) {
            return Direction.UP;
        }
        else if (diff.y === 1) {
            return Direction.DOWN;
        }
    }
}