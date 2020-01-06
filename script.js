$(document).ready(function () {
    const tile_size = 32;
    const tiles_num = 15;
    const canvas_size = tiles_num * tile_size;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvas_size;
    canvas.height = canvas_size;
    ctx.fillStyle = "#75CB75";
    ctx.fillRect(0, 0, canvas_size, canvas_size);

    function showGrid() {
        ctx.fillStyle = "#000000";
        let times = Math.floor(canvas_size / tile_size);
        console.log(times);
        for (let i = 1; i <= times; i++) {
            coord = i * tile_size;
            ctx.beginPath();
            ctx.moveTo(coord, 0);
            ctx.lineTo(coord, canvas_size);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, coord);
            ctx.lineTo(canvas_size, coord);
            ctx.stroke();
        }
    }
    showGrid();

    
    var Direction = {
        UP: 1,
        RIGHT: 2,
        DOWN: 3,
        LEFT: 4
    };

    var NodeType = {
        TREE: "img/tree.png",
        ROCK: "img/rock.png",
        WATER: "img/water.png",
        FLOWER1: "img/flower1.png",
        FLOWER2: "img/flower2.png"
    };

    
    let tileSize = 64;
    let mapSize = 10;
    let map = new Array(10)
    for (i = 0; i < 10; i++) {
        map[i] = new Array(mapSize);
    }

    class Position {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        static isValid(position) {
            if (position.x < 0 || position.x >= 10 || position.y < 0 || position.y >= 10) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    class Node {
        constructor(parent, nodeType, direction) {
            this.isParent = false;
            if (parent == null || parent == undefined) {
                console.log("Unable to add node with empty parent.");
                return;
            }

            this.nodes = [];
            this.position = getChildPosition(parent, direction);
            this.nodeType = nodeType;

            this.parent = parent;
            this.direction = direction;
        }

        static getChildPosition(parent, direction) {
            let x = parent.x;
            let y = parent.y;

            switch (direction) {
                case Direction.LEFT:
                    x--;
                    break;
                case Direction.RIGHT:
                    x++;
                    break;
                case Direction.UP:
                    y--;
                    break;
                case Direction.DOWN:
                    y++;
                    break;
            }

            let newPosition = new Position(x, y);
            return newPosition;
        }

        static init(position, nodeType) {
            if (Position.isValid(position) == false) {
                console.log("Unable to init. Invalid position.");
                return;
            }

            this.position = position;

            this.isParent = true;
            this.nodeType = nodeType;
        }

        addNext(nodeType, direction) {

            if (this.nodes.some(node => node.direction === direction)) {
                console.log("Two nodes can't have same direction");
                return;
            }

            let newNode = new Node(this, nodeType, direction);
            this.nodes.push(newNode);

            return newNode;
        }

        draw() {

            let real_x = this.x * tileSize;
            let real_y = this.y * tileSize;

            // const canvas = document.getElementById('canvas');
            // const ctx = canvas.getContext('2d');

            // const image = new Image(tileSize, tileSize);
            // image.onload = drawImageActualSize; // Draw when image has loaded

            // Load an image of intrinsic size 300x227 in CSS pixels
            // image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg'
            // ctx.drawImage(this, 0, 0, this.width, this.height);

            // this.nodes.forEach(child => {
            //     child.draw();
            // })
        }
    }

    function drawTile(nodeType, x, y) {
        const image = new Image(32, 32);
        image.onload = drawImageActualSize;
        image.src = nodeType;

        let canvas_x = (x - 1) * tile_size;
        let canvas_y = (y - 1) * tile_size;
        function drawImageActualSize() {
            ctx.drawImage(this, canvas_x, canvas_y, this.width, this.height);
        }
    }
    
    drawTile(NodeType.TREE,1,1);    
    drawTile(NodeType.FLOWER2,2,2);    
});