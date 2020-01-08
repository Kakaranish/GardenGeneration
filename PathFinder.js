class PathFinder {
    constructor(map) {
        this.map = map;
    }

    findPathToBridge(from_point) {
        if (this.map.tiles[from_point.x - 1][from_point.y - 1] !== undefined) {
            console.log("Path finding failure - can't start in " +
                from_point.x + "," + from_point.y + ".");
            return null;
        }

        let to_point = {
            "x": this.map.bridge.x,
            "y": this.map.bridge.y
        }

        // let to_point = {
        //     "x": 30,
        //     "y": 18
        // }

        console.log("Bridge");
        console.log(to_point);
        let cameFrom = [];
        let cameFrom2 = new Array(this.map.width)
        for (let i = 0; i < this.map.width; i++) {
            cameFrom2[i] = new Array(this.map.height);
            for (let j = 0; j < this.map.height; j++) {
                cameFrom2[i][j] = undefined;
            }
        }
        let openSet = [{
            "x": from_point.x,
            "y": from_point.y,
            "score": this.heuristic(from_point, to_point)
        }];
        let gScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        let fScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);

        gScore[from_point.x - 1][from_point.y - 1].score = 0;
        fScore[from_point.x - 1][from_point.y - 1].score =
            this.heuristic(from_point, to_point);
        console.log(this.heuristic(from_point, to_point));
        
        while (openSet.length > 0) {
            let current = PathFinder.findLowestFScoreInArray(openSet);
            console.log(current);

            if (this.isInBridgeNeighbourhood(current)) {
                cameFrom.push({
                    "x": current.x,
                    "y": current.y
                });
                cameFrom2.unshift({
                    "x": current.x,
                    "y": current.y
                });
                return cameFrom2;
                // return cameFrom;
            }

            PathFinder.removePointFromArray(openSet, current);

            let neighbours = this.getPointEmptyNeighbours(current);
            
            neighbours.forEach(neighbour => {
                let tentative_gScore = gScore[current.x - 1][current.y - 1].score
                    + this.heuristic(current, neighbour); //always 1
                // console.log(this.heuristic(current, neighbour));
                // console.log(gScore[neighbour.x - 1][neighbour.y - 1].score);
                // console.log(tentative_gScore)
                if (tentative_gScore < gScore[neighbour.x - 1][neighbour.y - 1].score) {
                    // if(PathFinder.isPointInArray(cameFrom, neighbour))
                    cameFrom2[neighbour.x - 1][neighbour.y - 1] = current;
                    cameFrom.push({
                        "x": neighbour.x,
                        "y": neighbour.y
                    });
                    // if (PathFinder.isPointInArray(cameFrom, neighbour) === false) { // TODO: Validate
                    // }
                    gScore[neighbour.x - 1][neighbour.y - 1].score = tentative_gScore;

                    let newFScore = tentative_gScore + this.heuristic(neighbour, to_point);
                    fScore[neighbour.x - 1][neighbour.y - 1].score = newFScore;
                    neighbour.score = newFScore;

                    let isNeighbourInOpenSet = PathFinder.isPointInArray(openSet, neighbour);
                    if (isNeighbourInOpenSet === false) {
                        openSet.push(neighbour);
                    }
                }
            });
        }

        console.log("Path finding failure - openSet is empty.");
        return null;
    }

    findPath(from_point, to_point) {
        if (this.map.tiles[from_point.x - 1][from_point.y - 1] !== undefined) {
            console.log("Path finding failure - can't start in " +
                from_point.x + "," + from_point.y + ".");
            return null;
        }

        let cameFrom = [];
        let openSet = [from_point];
        let gScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        let fScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);

        gScore[from_point.x - 1][from_point.y - 1].score = 0;
        fScore[from_point.x - 1][from_point.y - 1] =
            this.heuristic(from_point, to_point);
        while (openSet.length > 0) {
            let current = PathFinder.findLowestFScoreInArray(openSet);
            if (current.x == to_point.x && current.y == to_point.y) {
                cameFrom.push({
                    "x": current.x,
                    "y": current.y
                });
                return cameFrom;
            }

            PathFinder.removePointFromArray(openSet, current);

            
            let neighbours = this.getPointEmptyNeighbours(current);
            neighbours.forEach(neighbour => {
                let tentative_gScore = gScore[current.x - 1][current.y - 1].score
                    + this.heuristic(current, neighbour);
                
                if (tentative_gScore < gScore[neighbour.x - 1][neighbour.y - 1].score) {
                    if (PathFinder.isPointInArray(cameFrom, current) === false) {
                        cameFrom.push({
                            "x": current.x,
                            "y": current.y
                        });
                    }
                    gScore[neighbour.x - 1][neighbour.y - 1].score = tentative_gScore;

                    let newFScore = tentative_gScore + this.heuristic(neighbour, to_point);
                    fScore[neighbour.x - 1][neighbour.y - 1].score = newFScore;
                    neighbour.score = newFScore;

                    let isNeighbourInOpenSet = PathFinder.isPointInArray(openSet, neighbour);
                    if (isNeighbourInOpenSet === false) {
                        openSet.push(neighbour);
                    }
                }
            });
        }

        console.log("Path finding failure - openSet is empty.");
        return null;
    }

    isInBridgeNeighbourhood(point) {
        let nonEmptyNeighbours = this.getPointNonEmptyTileNeighbours(point);
        for(let i = 0; i < nonEmptyNeighbours.length; i++){
            let neighbour = nonEmptyNeighbours[i];
            if (neighbour.tileType === TileType.BRIDGE) {
                return true;
            }
        }
        return false;
    }

    heuristic(point, goal) {
        let dx = Math.abs(point.x - goal.x);
        let dy = Math.abs(point.y - goal.y);
        return dx + dy;
    }

    getPointNonEmptyTileNeighbours(point) {
        let neighbours = [];
        let tentative_neighbours = PathFinder.getTentativeNeighbours(point);
        tentative_neighbours.forEach(tentative_neighbour => {
            if (tentative_neighbour.x < 1 || tentative_neighbour.x > this.map.width ||
                tentative_neighbour.y < 1 || tentative_neighbour.y > this.map.height) {
                return;
            }
            if (this.map.tiles[tentative_neighbour.x - 1][tentative_neighbour.y - 1] === undefined) {
                return;
            }

            neighbours.push(this.map.tiles[tentative_neighbour.x - 1][tentative_neighbour.y - 1]);
        });
        return neighbours;
    }

    getPointEmptyNeighbours(point) {
        let neighbours = [];
        let tentative_neighbours = PathFinder.getTentativeNeighbours(point);

        tentative_neighbours.forEach(tentative_neighbour => {
            if (tentative_neighbour.x < 1 || tentative_neighbour.x > this.map.width ||
                tentative_neighbour.y < 1 || tentative_neighbour.y > this.map.height) {
                return;
            }
            if (this.map.tiles[tentative_neighbour.x - 1][tentative_neighbour.y - 1] !== undefined) {
                return;
            }

            neighbours.push(tentative_neighbour);
        });

        console.log(neighbours);
        return neighbours;
    }

    static getTentativeNeighbours(point) {
        return [{ "x": point.x, "y": point.y - 1 },
        { "x": point.x + 1, "y": point.y },
        { "x": point.x, "y": point.y + 1 },
        { "x": point.x - 1, "y": point.y }]
    }

    static findLowestFScoreInArray(arr) {
        return arr.reduce((prev, current) => {
            return (prev.score < current.score) ? prev : current
        });
    }

    static getInitScoreArray(width, height) {
        let arr = new Array(width)
        for (let i = 0; i < width; i++) {
            arr[i] = new Array(height);
            for (let j = 0; j < height; j++) {
                arr[i][j] = {
                    "x": i,
                    "y": j,
                    "score": Infinity
                };
            }
        }
        return arr;
    }

    static isPointInArray(arr, point) {
        let foundIndex = arr.findIndex(arrPoint => {
            return arrPoint.x === point.x && arrPoint.y === point.y;
        });

        return foundIndex !== -1;
    }

    static removePointFromArray(arr, point) {
        let foundIndex = arr.findIndex(arrPoint => {
            return arrPoint.x === point.x && arrPoint.y === point.y;
        });
        if(foundIndex !== -1){
            arr.splice(foundIndex, 1);
        }
    }
}