class Map {
    constructor(canvas, width = MAP_WIDTH, height = MAP_HEIGHT) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.canvas.width = this.width * TILE_SIZE;
        this.canvas.height = this.height * TILE_SIZE;

        this.tiles = null;
        this.initTiles();

        this.waterTiles = null;
        this.initWaterTiles();

        this.bridge = null;

        this.fillBackground();
    }

    fillBackground() {
        this.context.fillStyle = "#75CB75";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initTiles() {
        this.tiles = new Array(this.width)
        for (let i = 0; i < this.width; i++) {
            this.tiles[i] = new Array(this.height);
        }
    }

    initWaterTiles() {
        this.waterTiles = new Array(this.width)
        for (let i = 0; i < this.width; i++) {
            this.waterTiles[i] = new Array(this.height);
        }
    }

    getTileType(x, y) {
        if (x < 1 || x > this.width || y < 1 || y > this.height) {
            return null;
        }
        let tile = this.tiles[x - 1][y - 1];
        return tile === undefined ? null : tile.tileType;
    }

    drawTiles() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
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
            this.context.lineTo(coord, canvas.height);
            this.context.stroke();
        }

        for (let i = 1; i <= y_times; i++) {
            let coord = i * TILE_SIZE;
            this.context.beginPath();
            this.context.moveTo(0, coord);
            this.context.lineTo(canvas.width, coord);
            this.context.stroke();
        }
    }

    draw() {
        this.drawTiles();
        this.drawGrid();
    }
}