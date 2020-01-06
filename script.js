$(document).ready(function () {
    const tileSize = 32;
    const tilesNum = 15;
    const canvasSize = tilesNum * tileSize;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.fillStyle = "#75CB75";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    function showGrid() {
        ctx.fillStyle = "#000000";
        let times = Math.floor(canvasSize / tileSize);
        console.log(times);
        for (let i = 1; i <= times; i++) {
            coord = i * tileSize;
            ctx.beginPath();
            ctx.moveTo(coord, 0);
            ctx.lineTo(coord, canvasSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, coord);
            ctx.lineTo(canvasSize, coord);
            ctx.stroke();
        }
    }

    var Direction = {
        UP: 1,
        RIGHT: 2,
        DOWN: 3,
        LEFT: 4
    };

    var TileType = {
        TREE: "img/tree.png",
        ROCK: "img/rock.png",
        WATER: "img/water.png",
        FLOWER1: "img/flower1.png",
        FLOWER2: "img/flower2.png"
    };

    let tiles = new Array(tilesNum)
    for (i = 0; i < tilesNum; i++) {
        tiles[i] = new Array(tilesNum);
    }

    class Tile {
        constructor(parent, nodeType, x, y) {
            this.parent = parent;
            this.nodeType = nodeType;
            this.x = x;
            this.y = y;
            this.childs = [];

            tiles[x - 1][y - 1] = this;
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

        addChild(nodeType, direction) {

            if (this.childs.some(child => child.direction === direction)) {
                console.log("Two childs can't have same direction");
                return null;
            }

            let child_coords = this.getChildCoords(direction);
            let child_x = child_coords[0];
            let child_y = child_coords[1];

            if (tiles[child_x - 1][child_y - 1] !== undefined) {
                console.log("Tile on " + child_x + "," + child_y + " already exists.");
                console.log(tiles);
                return null;
            }

            let child = new Tile(this, nodeType, child_x, child_y);
            this.childs.push(child);

            return child;
        }

        draw() {
            const image = new Image(tileSize, tileSize);
            image.onload = drawImageActualSize;
            image.src = this.nodeType;

            let canvas_x = (this.x - 1) * tileSize;
            let canvas_y = (this.y - 1) * tileSize;
            function drawImageActualSize() {
                ctx.drawImage(this, canvas_x, canvas_y, this.width, this.height);
            }
        }
    }

    function drawTiles() {
        for (let i = 0; i < tilesNum; i++) {
            for (let j = 0; j < tilesNum; j++) {
                let tile = tiles[i][j];
                if (tile === undefined) {
                    continue;
                }
                tile.draw();
            }
        }
    }

    function initSampleMap()
    {
        let rootTile = new Tile(null, TileType.WATER, 1, 7);
        rootTile.addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.DOWN)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.RIGHT)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.UP)
            .addChild(TileType.WATER, Direction.RIGHT);
        
        let waterTile1 = tiles[8 - 1][6- 1];
        let tree1 = waterTile1.addChild(TileType.TREE, Direction.UP);
        tree1.addChild(TileType.TREE, Direction.LEFT).addChild(TileType.TREE, Direction.DOWN);
        tree1.addChild(TileType.TREE, Direction.RIGHT);    
    }
    initSampleMap();
    drawTiles();
    showGrid();
});