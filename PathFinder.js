class PathFinder {
    constructor(map) {
        this.map = map;
    }

    findPathToBridge(from_point, fictiousObstacles = [], fictiousPaths = []) {
        if (this.map.tiles[from_point.x - 1][from_point.y - 1] !== undefined) {
            console.log("Path finding failure - can't start in " +
                from_point.x + "," + from_point.y + ".");
            return null;
        }
        let bridge = {
            "x": this.map.bridge.x,
            "y": this.map.bridge.y
        }
        let fictiousPathsMap = this.getFictiousPathsMapFrom(fictiousPaths);

        from_point.fScore = 0;
        let cameFrom = get2dArray(this.map.width, this.map.height, undefined);
        let openSet = [from_point];
        let gScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        let fScore = PathFinder.getInitScoreArray(this.map.width, this.map.height);
        gScore[from_point.x - 1][from_point.y - 1].score = 0;
        fScore[from_point.x - 1][from_point.y - 1].score = this.heuristic(from_point, bridge);

        while (openSet.length > 0) {
            let current = PathFinder.findLowestScoreInArray(openSet);
            if (this.isInBridgeNeighbourhood(current) ||
                this.isInOtherPathTileNeighbourhood(current) ||
                this.isPointInFictiousPathTileNeighbourhood(fictiousPathsMap, current)) {
                cameFrom[bridge.x - 1][bridge.y - 1] = current;
                return PathFinder.convertPathToPathMap(cameFrom, from_point, bridge);
            }

            PathFinder.removePointFromArray(openSet, current);

            let neighbours = this.getPointEmptyNeighbours(current, fictiousObstacles);
            neighbours.forEach(neighbour => {
                let heuristic = this.heuristic(current, neighbour)
                    + this.heuristicDeviation(current, neighbour, from_point);
                let tentative_gScore = gScore[current.x - 1][current.y - 1].score
                    + heuristic;
                if (tentative_gScore < gScore[neighbour.x - 1][neighbour.y - 1].score) {
                    gScore[neighbour.x - 1][neighbour.y - 1].score = tentative_gScore;

                    heuristic = this.heuristic(current, bridge)
                        + this.heuristicDeviation(current, bridge, from_point);
                    let newFScore = tentative_gScore + heuristic;
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

    heuristic(point, goal) {
        let dx = Math.abs(point.x - goal.x);
        let dy = Math.abs(point.y - goal.y);
        return dx + dy;
    }

    heuristicDeviation(current, goal, start) {
        let dx1 = current.x - goal.x;
        let dy1 = current.y - goal.y;
        let dx2 = start.x - goal.x;
        let dy2 = start.y - goal.y;
        let cross = Math.abs(dx1 * dy2 - dx2 * dy1);
        return cross * 0.001;
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

    isInOtherPathTileNeighbourhood(point) {
        let nonEmptyNeighbours = this.getPointNonEmptyTileNeighbours(point);
        for (let i = 0; i < nonEmptyNeighbours.length; i++) {
            let neighbour = nonEmptyNeighbours[i];
            if (neighbour.tileType === TileType.PATH) {
                return true;
            }
        }
        return false;
    }

    isPointInFictiousPathTileNeighbourhood(fictiousPathsMap, point) {
        if(fictiousPathsMap === null){
            return false;
        }

        let tentativeNeighbours = PathFinder.getTentativeNeighbours(point);
        for (let i = 0; i < tentativeNeighbours.length; i++) {
            let tentativeNeighbour = tentativeNeighbours[i];
            if(this.map.isPointLegal(tentativeNeighbour) === false){
                continue;
            }
            
            let neighbour = fictiousPathsMap[tentativeNeighbour.x - 1][tentativeNeighbour.y - 1];
            if (neighbour !== undefined) {
                return true;
            }
        }
        return false;
    }

    getFictiousPathsMapFrom(fictiousPaths) {
        if (fictiousPaths === undefined || fictiousPaths.length === 0) {
            return null;
        }

        let fictiousPathsMap = get2dArray(this.map.width, this.map.height, undefined);
        let flattenFictiousPaths = fictiousPaths.flat();
        flattenFictiousPaths.forEach(fictiousPathTile => {
            fictiousPathsMap[fictiousPathTile.x - 1][fictiousPathTile.y - 1] =
                fictiousPathTile;
        });
        return fictiousPathsMap;
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

    getPointEmptyNeighbours(point, fictiousObstacles = []) {
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
            if (PathFinder.isPointInArray(fictiousObstacles, tentative_neighbour)) {
                return;
            }

            neighbours.push(tentative_neighbour);
        });

        return neighbours;
    }

    static convertPathToPathMap(pathMap, startPoint, endPoint) {
        let path = [];
        let currentPoint = pathMap[endPoint.x - 1][endPoint.y - 1];
        path.push(currentPoint);
        while (true) {
            if (currentPoint.x === startPoint.x && currentPoint.y === startPoint.y) {
                break;
            }
            currentPoint = pathMap[currentPoint.x - 1][currentPoint.y - 1]
            path.push(currentPoint);
        }
        path.push(startPoint);

        return path;
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