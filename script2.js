
$(document).ready(function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let tileSize = 64;
    let mapSize = 10;
    let map = new Array(10)
    for (i = 0; i < 10; i++) {
        map[i] = new Array(mapSize);
    }


    var Direction = {
        UP: 1,
        RIGHT: 2,
        DOWN: 3,
        LEFT: 4
    };

    var NodeType = {
        TREE: "img/tree.png",
        FOUNTAIN: "img/fountain.png",
        PATH: "img/path.png"
    };

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

            let newNode = new Node()

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
            let real_pos = new Position(real_x, real_y);

            drawImage(real_pos, this.nodeType)

            this.nodes.forEach(child => {
                child.draw();
            })
        }


    }
    function drawImage(position, imgPath) {
        const image = new Image(32, 32);
        image.onload = drawImageActualSize;
        image.src = imgPath;

        function drawImageActualSize() {
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            ctx.drawImage(this, position.x, position.y, this.width, this.height);
        }
    }

    drawImage();
});