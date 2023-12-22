// RENDERING
const refreshRate = 80
const generations = 5

const renderWalls = function(wallColour) {
    ctx.fillStyle = wallColour
    grid.cells.forEach((_, index) => {
        if (grid.cells[index].isWall) {
            ctx.fillRect(grid.cells[index].x, grid.cells[index].y, grid.cellSize, grid.cellSize)
        }
    })
}

// CANVAS 
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = canvas.getContext('2d')

const clearCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const setFloorColour = function() {
    canvas.style.backgroundColor = document.getElementById('floorColour').value
}

const setWallColour = function() {
    let colour = document.getElementById('wallColour').value
    renderWalls(colour)
}

// GRID
const grid = {
    dimension: 60,
    previousCells: [],
    cells: [],
    wallCount: 0
}

grid.cellSize = (canvas.width / grid.dimension)

grid.clearAllCells = function() {
    grid.cells = []
}

grid.generateNoise = function() {
    grid.clearAllCells()
    for (j = 0; j < grid.dimension; j++) {
        for (i = 0; i < grid.dimension; i++) {
            grid.cells.push({
                x: (i * grid.cellSize),
                y: (j * grid.cellSize),
                isWall: Math.random() <= 0.4,
                edges: [],
                neighbouringWalls: 0
            })
        }
    }
    grid.findEdges()
    grid.findNeighbours()
}

grid.findEdges = function() {
    grid.cells.forEach((_, index) => {
        if (index < grid.dimension) {
            grid.cells[index].edges.push('top');
        }
        if ((index + 1) % grid.dimension === 0) {
            grid.cells[index].edges.push('right');
        }
        if (index >= grid.cells.length - grid.dimension) {
            grid.cells[index].edges.push('bottom');
        }
        if (index % grid.dimension === 0) {
            grid.cells[index].edges.push('left');
        }
    })
}

grid.findNeighbours = function() {

    grid.cells.forEach((_, i) => {

        // account for out-of-grid neighbours (i.e. implied walls beyond corners and edges)
        if (grid.cells[i].edges.length == 2) {
            grid.cells[i].neighbouringWalls += 5
        } else if (grid.cells[i].edges.length == 1) {
            grid.cells[i].neighbouringWalls += 3
        }

        // account for in-grid neighbours

        //check above (if not on top edge)
        if (!grid.cells[i].edges.includes("top")) {

            //above-left
            if (!grid.cells[i].edges.includes("left")) {
                if (grid.cells[i - grid.dimension - 1].isWall) {
                    grid.cells[i].neighbouringWalls++;
                }
            }

            //directly above
            if (grid.cells[i - grid.dimension].isWall) {
                grid.cells[i].neighbouringWalls++
            }

            //above-right
            if (!grid.cells[i].edges.includes("right")) {
                if (grid.cells[i - grid.dimension + 1].isWall) {
                    grid.cells[i].neighbouringWalls++
                }
            }
        }

        //check left (if not on left edge)
        if (!grid.cells[i].edges.includes("left")) {
            if (grid.cells[i - 1].isWall) {
                grid.cells[i].neighbouringWalls++
            }
        }

        //check right (if not on right edge)
        if (!grid.cells[i].edges.includes("right")) {
            if (grid.cells[i + 1].isWall) {
                grid.cells[i].neighbouringWalls++
            }
        }

        //check below (if not on bottom edge)
        if (!grid.cells[i].edges.includes("bottom")) {

            //below-left
            if (!grid.cells[i].edges.includes("left")) {
                if (grid.cells[i + grid.dimension - 1].isWall) {
                    grid.cells[i].neighbouringWalls++
                }
            }

            //directly below
            if (grid.cells[i + grid.dimension].isWall) {
                grid.cells[i].neighbouringWalls++
            }

            //below-right
            if (!grid.cells[i].edges.includes("right")) {
                if (grid.cells[i + grid.dimension + 1].isWall) {
                    grid.cells[i].neighbouringWalls++
                }
            }
        }
    })
}

grid.generateNextCells = function() {
    grid.wallCount = 0
    grid.previousCells = JSON.parse(JSON.stringify(grid.cells))
    grid.cells.forEach((_, index) => {
        let i = this.cells[index]
        if (i.neighbouringWalls >= 4 && i.neighbouringWalls <= 8) {
            i.isWall = true
            grid.wallCount++
        } else {
            i.isWall = false
        }
        i.neighbouringWalls = 0
    })
}

// EXECUTE
const generateCavern = function() {
    console.clear()
    grid.generateNoise()
    clearCanvas()
    renderWalls()
    let timer = setInterval(() => {
        grid.generateNextCells()
        console.log(grid.wallCount)
        renderWalls()
    }, refreshRate)
    setTimeout(() => { clearInterval(timer) }, generations * refreshRate)
}

setFloorColour()
setWallColour()
generateCavern()


// TO DO
// ? refactor to include a checkIfWall function