// CANVAS 

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = canvas.getContext('2d')

setFloorColour = function() {
    canvas.style.backgroundColor = document.getElementById('floorColour').value
}

setWallColour = function() {
    let colour = document.getElementById('wallColour').value
    grid.renderWalls(colour)
}

// GRID

const grid = {
    dimension: 100,
    previousCells: [],
    cells: []
}

grid.cellSize = (canvas.width / grid.dimension)

grid.generateNoise = function() {
    for (j = 0; j < grid.dimension; j++) {
        for (i = 0; i < grid.dimension; i++) {
            grid.cells.push({
                x: Math.ceil(i * grid.cellSize),
                y: Math.ceil(j * grid.cellSize),
                isWall: Math.random() <= 0.4,
                edges: [],
                neighbouringWalls: 0
            })
        }
    }
}

grid.renderWalls = function(wallColour) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = wallColour
    grid.cells.forEach((_, index) => {
        //console.log(this.cells[index])
        if (this.cells[index].isWall) {
            ctx.fillRect(this.cells[index].x, this.cells[index].y, grid.cellSize, grid.cellSize)
        }
    }, grid)
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

grid.findNeighbours = function(cell) {
    //let neighbouringWalls = 0

    // account for out-of-grid neighbours (i.e. implied walls beyond corners and edges)
    if (grid.cells[cell].edges.length == 2) {
        grid.cells[cell].neighbouringWalls += 5
    } else if (grid.cells[cell].edges.length == 1) {
        grid.cells[cell].neighbouringWalls += 3
    }

    // account for in-grid neighbours

    //check above (if not on top edge)
    if (!grid.cells[cell].edges.includes("top")) {

        //above-left
        if (!grid.cells[cell].edges.includes("left")) {
            if (grid.cells[cell - grid.dimension - 1].isWall) {
                grid.cells[cell].neighbouringWalls++;
            }
        }

        //directly above
        if (grid.cells[cell - grid.dimension].isWall) {
            grid.cells[cell].neighbouringWalls++
        }

        //above-right
        if (!grid.cells[cell].edges.includes("right")) {
            if (grid.cells[cell - grid.dimension + 1].isWall) {
                grid.cells[cell].neighbouringWalls++
            }
        }
    }

    //check left (if not on left edge)
    if (!grid.cells[cell].edges.includes("left")) {
        if (grid.cells[cell - 1].isWall) {
            grid.cells[cell].neighbouringWalls++
        }
    }

    //check right (if not on right edge)
    if (!grid.cells[cell].edges.includes("right")) {
        if (grid.cells[cell + 1].isWall) {
            grid.cells[cell].neighbouringWalls++
        }
    }

    //check below (if not on bottom edge)
    if (!grid.cells[cell].edges.includes("bottom")) {

        //below-left
        if (!grid.cells[cell].edges.includes("left")) {
            if (grid.cells[cell + grid.dimension - 1].isWall) {
                grid.cells[cell].neighbouringWalls++
            }
        }

        //directly below
        if (grid.cells[cell + grid.dimension].isWall) {
            grid.cells[cell].neighbouringWalls++
        }

        //below-right
        if (!grid.cells[cell].edges.includes("right")) {
            if (grid.cells[cell + grid.dimension + 1].isWall) {
                grid.cells[cell].neighbouringWalls++
            }
        }
    }

    //console.log(`Cell ${cell} is neighboured by ${grid.cells[cell].neighbouringWalls} walls`)
}

grid.generateNextCells = function() {
    grid.previousCells = grid.cells
    this.cells = this.previousCells.map((_, index) => {
        let i = this.cells[index]
        if (i.neighbouringWalls >= 4 && i.neighbouringWalls <= 8) {
            i.isWall = true
        } else {
            i.isWall = false
        }
        i.neighbouringWalls = 0
        return i
    }, grid)
}

const generateCavern = function(generations, refreshRate) {
    grid.generateNoise()
    grid.renderWalls()
    grid.findEdges()
    let timer = setInterval(() => {
        grid.cells.forEach((_, j) => {
            grid.findNeighbours(j)
        })
        grid.generateNextCells()
        grid.renderWalls()
    }, refreshRate)
    setTimeout(() => { clearInterval(timer) }, generations * refreshRate)
}

// EXECUTE
setFloorColour()
setWallColour()
generateCavern(5, 80)


// TO DO
// refactor Regenerate button so it don't refresh the page
// ? refactor to include a checkIfWall function