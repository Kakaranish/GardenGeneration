class Tile {
    constructor(map, tileType, x, y) {
        this.map = map;
        this.tileType = tileType;
        this.x = x;
        this.y = y;

        this.map.tiles[x - 1][y - 1] = this;
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

    isInRelationWithOtherTileInDirection(direction, childTileType = undefined) {
        let otherTileCoords = this.getNeighbourCoords(direction);
        if (this.map.isPointLegal(otherTileCoords) === false) {
            return false;
        }
        let otherTile = this.map.tiles[otherTileCoords.x - 1][otherTileCoords.y - 1];

        if (childTileType !== undefined) {
            return otherTile !== undefined && otherTile.tileType === childTileType;
        }
        return otherTile !== undefined;
    }

    getNeighbourCoords(direction) {
        let neighbourCoords = {
            "x": this.x,
            "y": this.y
        };

        switch (direction) {
            case Direction.LEFT:
                neighbourCoords.x--;
                break;
            case Direction.RIGHT:
                neighbourCoords.x++;
                break;
            case Direction.UP:
                neighbourCoords.y--;
                break;
            case Direction.DOWN:
                neighbourCoords.y++;
                break;
        }
        return neighbourCoords;
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

    isFloraType() {
        return this.tileType === TileType.FLOWER1 ||
            this.tileType === TileType.FLOWER2 ||
            this.tileType === TileType.TREE ||
            this.tileType === TileType.ROCK;
    }
}