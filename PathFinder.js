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

        let bridge = {
            "x": this.map.bridge.x,
            "y": this.map.bridge.y
        }

        from_point.fScore = 0;
        let cameFrom = get2dArray(this.map.width, this.map.height, undefined);
        let openSet = [from_point];
        let gScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        let fScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        gScore[from_point.x - 1][from_point.y - 1].score = 0;
        fScore[from_point.x - 1][from_point.y - 1].score = this.heuristic(from_point, bridge);

        while (openSet.length > 0) {
            let current = PathFinder.findLowestScoreInArray(openSet);
            if (this.isInBridgeNeighbourhood(current)) {
                cameFrom[bridge.x - 1][bridge.y - 1] = current;
                return PathFinder.getPathFromPathMap(cameFrom, from_point, bridge);
            }

            PathFinder.removePointFromArray(openSet, current);

            let neighbours = this.getPointEmptyNeighbours(current);
            neighbours.forEach(neighbour => {
                let tentative_gScore = gScore[current.x - 1][current.y - 1].score
                    + this.heuristic(current, neighbour); //always 1
                if (tentative_gScore < gScore[neighbour.x - 1][neighbour.y - 1].score) {
                    gScore[neighbour.x - 1][neighbour.y - 1].score = tentative_gScore;

                    let newFScore = tentative_gScore + this.heuristic(neighbour, bridge);
                    fScore[neighbour.x - 1][neighbour.y - 1].score = newFScore;
                    neighbour.score = newFScore;

                    cameFrom[neighbour.x - 1][neighbour.y - 1] = current;

                    if (PathFinder.isPointInArray(openSet, neighbour) === false) {
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
        
        from_point.fScore = 0;
        
        let cameFrom = get2dArray(this.map.width, this.map.height, undefined);
        let openSet = [from_point];
        let gScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        let fScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        gScore[from_point.x - 1][from_point.y - 1].score = 0;
        fScore[from_point.x - 1][from_point.y - 1] = this.heuristic(from_point, to_point);

        while (openSet.length > 0) {
            let current = PathFinder.findLowestScoreInArray(openSet);
            if (current.x === to_point.x && current.y === to_point.y) {
                return PathFinder.getPathFromPathMap(cameFrom, from_point, to_point);
            }

            PathFinder.removePointFromArray(openSet, current);

            let neighbours = this.getPointEmptyNeighbours(current);
            neighbours.forEach(neighbour => {
                let tentative_gScore = gScore[current.x - 1][current.y - 1].score
                    + this.heuristic(current, neighbour);
                if (tentative_gScore < gScore[neighbour.x - 1][neighbour.y - 1].score) {
                    gScore[neighbour.x - 1][neighbour.y - 1].score = tentative_gScore;
                    
                    let newFScore = tentative_gScore + this.heuristic(neighbour, to_point);
                    fScore[neighbour.x - 1][neighbour.y - 1].score = newFScore;
                    neighbour.score = newFScore;
                    
                    cameFrom[neighbour.x - 1][neighbour.y - 1] = current;

                    if (PathFinder.isPointInArray(openSet, neighbour) === false) {
                        openSet.push(neighbour);
                    }
                }
            });
        }

        console.log("Path finding failure - openSet is empty.");
        return null;
    }

    static getPathFromPathMap(pathMap, start_point, end_point){
        let path = [];
        let prev = pathMap[end_point.x - 1][end_point.y - 1];
        path.push(prev);
        while(true){
            if(prev.x === start_point.x && prev.y === start_point.y){
                break;
            }
            prev = pathMap[prev.x - 1][prev.y - 1]
            path.push(prev);
        }
        path.push(start_point);

        return path;
    }

    isInBridgeNeighbourhood(point) {
        let nonEmptyNeighbours = this.getPointNonEmptyTileNeighbours(point);
        for (let i = 0; i < nonEmptyNeighbours.length; i++) {
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

        return neighbours;
    }

    static getTentativeNeighbours(point) {
        return [{ "x": point.x, "y": point.y - 1 },
        { "x": point.x + 1, "y": point.y },
        { "x": point.x, "y": point.y + 1 },
        { "x": point.x - 1, "y": point.y }]
    }

    static findLowestScoreInArray(arr) {
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
        return arr.some(element => element.x === point.x && element.y === point.y);
    }

    static removePointFromArray(arr, point) {
        let foundIndex = arr.findIndex(arrPoint => {
            return arrPoint.x === point.x && arrPoint.y === point.y;
        });
        if (foundIndex !== -1) {
            arr.splice(foundIndex, 1);
        }
    }
}