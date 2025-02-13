class Map {
    constructor() {
        this.canvas = null;
        this.context = null;

        this.tiles = null;
        this.initTiles();

        this.waterTiles = [];
        this.pathTiles = [];
        this.bridge = null;
    }

    initTiles() {
        this.tiles = new Array(MAP_WIDTH)
        for (let i = 0; i < MAP_WIDTH; i++) {
            this.tiles[i] = new Array(MAP_HEIGHT);
        }
    }

    getTileType(x, y) {
        if (x < 1 || x > MAP_WIDTH || y < 1 || y > MAP_HEIGHT) {
            return null;
        }
        let tile = this.tiles[x - 1][y - 1];
        return tile === undefined ? null : tile.tileType;
    }

    drawTiles() {
        for (let i = 0; i < MAP_WIDTH; i++) {
            for (let j = 0; j < MAP_HEIGHT; j++) {
                let tile = this.tiles[i][j];
                if (tile === undefined) {
                    continue;
                }
                tile.draw();
            }
        }
    }

    drawGrid() {
        this.context.fillStyle = "#000000";

        let x_times = Math.floor(this.canvas.width / TILE_SIZE);
        let y_times = Math.floor(this.canvas.height / TILE_SIZE);
        for (let i = 1; i <= x_times; i++) {
            let coord = i * TILE_SIZE;
            this.context.beginPath();
            this.context.moveTo(coord, 0);
            this.context.lineWidth = 0.75;
            this.context.lineTo(coord, this.canvas.height);
            this.context.stroke();
        }

        for (let i = 1; i <= y_times; i++) {
            let coord = i * TILE_SIZE;
            this.context.beginPath();
            this.context.lineWidth = 0.75;
            this.context.moveTo(0, coord);
            this.context.lineTo(this.canvas.width, coord);
            this.context.stroke();
        }
    }

    draw() {
        if (this.canvas !== null) {
            this.drawTiles();
            this.drawGrid();
        }
        else {
            console.log("No canvas. Unable to draw map");
        }
    }

    isPointLegal(point) {
        return point.x >= 1 && point.x <= MAP_WIDTH
            && point.y >= 1 && point.y <= MAP_HEIGHT;
    }

    isBridgeLegal(x, y) {
        let tile_type = this.getTileType(x, y);
        if (tile_type !== TileType.WATER) {
            return false;
        }

        let tile_type_above = this.getTileType(x, y - 1);
        let tile_type_on_right = this.getTileType(x + 1, y);
        let tile_type_below = this.getTileType(x, y + 1);
        let tile_type_on_left = this.getTileType(x - 1, y);

        if ((tile_type_above && tile_type_on_right) || (tile_type_on_right && tile_type_below)
            || (tile_type_below && tile_type_on_left) || (tile_type_on_left && tile_type_above)) {
            return false;
        }
        return true;
    }

    // Validation if brook?
    countTilesAboveBrook() {
        let totalEmptyTilesCount = 0;
        for (let col = 0; col < MAP_WIDTH; col++) {
            let firstWaterTileIndex = this.tiles[col].findIndex(tile => {
                return tile !== undefined && (tile.tileType === TileType.WATER
                    || tile.tileType === TileType.BRIDGE);
            });
            if (firstWaterTileIndex === -1) {
                return null;
            }

            let emptyTilesCount = firstWaterTileIndex -
                this.tiles[col].filter(function (value, index) {
                    return value.tileType !== undefined && index < firstWaterTileIndex;
                }).length;
            totalEmptyTilesCount += emptyTilesCount;
        }

        return totalEmptyTilesCount;
    }

    countTilesBelowBrook() {
        let totalEmptyTilesCount = 0;
        for (let col = 0; col < MAP_WIDTH; col++) {
            let firstWaterTileIndex = this.tiles[col].findIndex(tile => {
                return tile !== undefined && (tile.tileType === TileType.WATER
                    || tile.tileType === TileType.BRIDGE);
            });
            if (firstWaterTileIndex === -1) {
                return null;
            }

            let waterTilesCount = this.tiles[col].reduce((count, value) => {
                return count + (value.tileType === TileType.WATER);
            }, 0);
            let lastWaterTileIndex = firstWaterTileIndex + waterTilesCount;

            let nonEmptyTilesCount = this.tiles[col].reduce((count, value, index) => {
                return count + (value !== undefined && index > lastWaterTileIndex);
            }, 0);
            let emptyTilesCount = this.tiles[col].length - lastWaterTileIndex - nonEmptyTilesCount;
            totalEmptyTilesCount += emptyTilesCount;
        }
        return totalEmptyTilesCount;
    }

    getEmptyTilesCount() {
        let totalTilesCount = MAP_WIDTH * MAP_HEIGHT;
        let nonEmptyTilesCount = this.tiles.filter(tile => tile !== undefined).length;
        return totalTilesCount - nonEmptyTilesCount;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.canvas.width = MAP_WIDTH * TILE_SIZE;
        this.canvas.height = MAP_HEIGHT * TILE_SIZE;
        this.fillBackground();
    }

    fillBackground() {
        this.context.fillStyle = "#75CB75";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}