class PathFinder {
    constructor(map) {
        this.map = map;
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

        gScore[from_point.x - 1][from_point.y - 1].fScore = 0;
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

            let neighbours = this.getPointNeighbours(current);
            neighbours.forEach(neighbour => {
                let tentative_gScore = gScore[current.x - 1][current.y - 1].fScore
                    + this.heuristic(current, neighbour);

                if (tentative_gScore < gScore[neighbour.x - 1][neighbour.y - 1].fScore) {
                    if (PathFinder.isPointInArray(cameFrom, current) == false) {
                        cameFrom.push({
                            "x": current.x,
                            "y": current.y
                        });
                    }
                    gScore[neighbour.x - 1][neighbour.y - 1].fScore = tentative_gScore;

                    let newFScore = tentative_gScore
                        + this.heuristic(neighbour, to_point);
                    fScore[neighbour.x - 1][neighbour.y - 1].fScore =
                        neighbour.fScore = newFScore;

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

    heuristic(point, goal) {
        let dx = Math.abs(point.x - goal.x);
        let dy = Math.abs(point.y - goal.y);
        return dx + dy;
    }

    getPointNeighbours(point) {
        let neighbours = [];
        let tentative_neighbours = [{ "x": point.x, "y": point.y - 1 },
        { "x": point.x + 1, "y": point.y }, { "x": point.x, "y": point.y + 1 },
        { "x": point.x - 1, "y": point.y }]

        tentative_neighbours.forEach(tentative_neighbour => {
            if (tentative_neighbour.x < 1 || tentative_neighbour.x > this.map.width ||
                tentative_neighbour.y < 1 || tentative_neighbour.y > this.map.height) {
                return;
            }
            if (this.map.tiles[tentative_neighbour.x - 1][tentative_neighbour.y] !== undefined) {
                return;
            }

            neighbours.push(tentative_neighbour);
        });

        return neighbours;
    }

    static findLowestFScoreInArray(arr) {
        return arr.reduce(function (prev, current) {
            return (prev.fScore < current.fScore) ? prev : current
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
                    "fScore": Infinity
                };
            }
        }
        return arr;
    }

    static isPointInArray(arr, point) {
        let foundIndex = arr.findIndex(function (arrPoint) {
            return arrPoint.x === point.x && arrPoint.y === point.y;
        });

        return foundIndex !== -1;
    }

    static removePointFromArray(arr, point) {
        let foundIndex = arr.findIndex(function (arrPoint) {
            return arrPoint.x === point.x && arrPoint.y === point.y;
        });
        arr.splice(foundIndex, 1);
    }
}