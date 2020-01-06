$(document).ready(function () {
    const tileSize = 32;
    const tilesNum = 20;
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
        constructor(parent, tileType, x, y) {
            this.parent = parent;
            this.tileType = tileType;
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

        addChild(tileType, direction) {
            if (this.childs.some(child => child.direction === direction)) {
                console.log("Two childs can't have same direction");
                return null;
            }

            let child_coords = this.getChildCoords(direction);
            let child_x = child_coords[0];
            let child_y = child_coords[1];

            if (tiles[child_x - 1][child_y - 1] !== undefined) {
                console.log("Tile on " + child_x + "," + child_y + " already exists.");
                return null;
            }

            if (tileType === TileType.WATER) {
                let isLegal = true;
                if (direction === Direction.UP) {
                    let tile_type_above = getTileType(child_x, child_y - 1);
                    let tile_type_on_left = getTileType(child_x - 1, child_y);
                    let tile_type_on_right = getTileType(child_x + 1, child_y);
                    if (tile_type_above || tile_type_on_left || tile_type_on_right) {
                        isLegal = false;
                    }
                }
                else if (direction === Direction.DOWN) {
                    let tile_type_below = getTileType(child_x, child_y + 1);
                    let tile_type_on_left = getTileType(child_x - 1, child_y);
                    let tile_type_on_right = getTileType(child_x + 1, child_y);
                    if (tile_type_below || tile_type_on_left || tile_type_on_right) {
                        isLegal = false;
                    }
                }
                else if (direction === Direction.LEFT) {
                    let tile_type_above = getTileType(child_x, child_y - 1);
                    let tile_type_below = getTileType(child_x, child_y + 1);
                    let tile_type_on_left = getTileType(child_x - 1, child_y);
                    if (tile_type_below || tile_type_above || tile_type_on_left) {
                        isLegal = false;
                    }
                }
                else if (direction === Direction.RIGHT) {
                    let tile_type_above = getTileType(child_x, child_y - 1);
                    let tile_type_below = getTileType(child_x, child_y + 1);
                    let tile_type_on_right = getTileType(child_x + 1, child_y);
                    if (tile_type_below || tile_type_above || tile_type_on_right) {
                        isLegal = false;
                    }
                }

                if (isLegal == false) {
                    console.log("Illegal water path.");
                    return null;
                }
            }

            let child = new Tile(this, tileType, child_x, child_y);
            return child;
        }

        draw() {
            const image = new Image(tileSize, tileSize);
            image.onload = drawImageActualSize;
            image.src = this.tileType;

            let canvas_x = (this.x - 1) * tileSize;
            let canvas_y = (this.y - 1) * tileSize;
            function drawImageActualSize() {
                ctx.drawImage(this, canvas_x, canvas_y, this.width, this.height);
            }
        }
    }

    function getTileType(x, y) {
        if (x < 1 || x > tilesNum || y < 1 || y > tilesNum) {
            return null;
        }
        tile = tiles[x - 1][y - 1];
        return tile === undefined ? null : tile.tileType;
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

    function generateWaterPath() {
        const break_size = 3;
        let init_y = Math.floor(Math.random() * tilesNum) + 1;
        let breaks_num = Math.floor(Math.random() * 5) + 2;
        let max_movement = Math.floor(tilesNum / breaks_num) + 2;

        let remaining_movement = tilesNum;
        let horizontal_movements = [];

        console.log("Breaks num = " + breaks_num);
        console.log("Max movement = " + max_movement);
        for (let i = 1; i <= breaks_num; i++) {
            if (i == breaks_num) {
                horizontal_movements.push(remaining_movement);
                break;
            }

            let reserved_movements_capacity = (breaks_num - i) * break_size;
            let movement = 0;
            do {
                movement = Math.floor(Math.random() * (max_movement - break_size))
                    + break_size;
            } while (remaining_movement - movement < reserved_movements_capacity);
            horizontal_movements.push(movement);
            remaining_movement -= movement;
        }

        console.log(horizontal_movements);

        let rootTile = new Tile(null, TileType.WATER, 1, init_y);
        let prevTile = rootTile;

        for (let i = 0; i < horizontal_movements.length; i++) {
            let movements_num = horizontal_movements[i];
            let j = i == 0 ? 2 : 1;
            for (j; j <= movements_num; j++) {
                let newTile = null;
                do {
                    newTile = prevTile.addChild(TileType.WATER, Direction.RIGHT);
                } while (newTile == null);
                prevTile = newTile;
            }

            let isMovementUp = Math.round(Math.random());
            let maxYMovement = 0;
            if (isMovementUp) {
                maxYMovement = prevTile.y - 1;
                if (maxYMovement < 1) {
                    isMovementUp = false;
                    maxYMovement = tilesNum - prevTile.y;
                }
            } else {
                maxYMovement = tilesNum - prevTile.y;
                if (maxYMovement < 1) {
                    isMovementUp = true;
                    maxYMovement = prevTile.y - 1;
                }
            }

            let movements = Math.floor(Math.random() * (maxYMovement - 1)) + 1;
            for (let j = 0; j < movements; j++) {
                let movementDirection = isMovementUp ? Direction.UP : Direction.DOWN;
                prevTile = prevTile.addChild(TileType.WATER, movementDirection);
            }
        }
    }

    function initSampleMap() {
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

    // initSampleMap();
    generateWaterPath();
    drawTiles();
    showGrid();
});