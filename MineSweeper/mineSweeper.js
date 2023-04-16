//JS spagetti monster 💀
const gridBoardHTML = document.getElementById("gridBoard")
let mineLeftDisplay = document.getElementById("mineLeftDisplay")
let gridBoardArray = []
let gridBoardMap = new Map()
let rows = 8
let cols = 8
let bomb = 9
let isGameOver = false
let isRevealingNearbyGrid = false

let unrevealedGrid = rows * cols
let unrevealedBombGrid = bomb

class Difficulty {
    constructor(rows, cols, bomb) {
        this.rows = rows
        this.cols = cols
        this.bomb = bomb
    }
}

let expert = new Difficulty(16, 30, 99)
let medium = new Difficulty(16, 16, 40)
let easy = new Difficulty(9, 9, 10)
let classic = new Difficulty(8, 8, 9)

let currentDifficulty = classic

function CreateGridBoard() {
    for (let i = 0; i < rows; i++) {
        const rows = document.createElement("tr")
        gridBoardArray[i] = []
        for (let j = 0; j < cols; j++) {
            const grid = document.createElement("td")
            grid.setAttribute("id", `X_${j}_Y_${i}`)
            grid.setAttribute("class", "grid hidden")
            grid.oncontextmenu = FlaggingGrid
            rows.appendChild(grid)
            gridBoardArray[i][j] = 0
        }
        gridBoardHTML.appendChild(rows)
    }
}
function CreateGridBoardMap() {
    for (let i = 0; i < gridBoardArray.length; i++) {
        for (let j = 0; j < gridBoardArray[i].length; j++) {
            AddEdge(j, i)
        }
    }
}
function AddEdge(gridPosX, gridPosY) {
    let grid = document.getElementById(`X_${gridPosX}_Y_${gridPosY}`)

    if (gridBoardArray[gridPosY][gridPosX] != 0) { return }

    let gridNeighbour = []
    for (let i = gridPosX - 1; i <= gridPosX + 1; i++) {
        for (let j = gridPosY - 1; j <= gridPosY + 1; j++) {

            let gridTarget = document.getElementById(`X_${i}_Y_${j}`)

            if (gridTarget == null) { continue }
            if (i == gridPosX && j == gridPosY) { continue }

            gridNeighbour[gridNeighbour.length] = gridTarget
        }
    }
    gridBoardMap.set(grid, gridNeighbour)
}
function CreateBombInGridBoardArray() {
    for (let i = 0; i < bomb; i++) {
        let x = Math.floor(Math.random() * cols)
        let y = Math.floor(Math.random() * rows)
        if (gridBoardArray[y][x] > 8) {
            i--
            continue
        }
        let grid = document.getElementById(`X_${x}_Y_${y}`)
        grid.className = "grid hidden bomb"
        gridBoardArray[y][x] = 8
        IncreaseGridNearBomb(x, y)
    }
}
function IncreaseGridNearBomb(gridPosX, gridPosY) {
    for (let i = gridPosX - 1; i <= gridPosX + 1; i++) {
        for (let j = gridPosY - 1; j <= gridPosY + 1; j++) {
            let gridTarget = document.getElementById(`X_${i}_Y_${j}`)
            if (gridTarget == undefined) { continue }
            gridBoardArray[j][i]++
        }
    }
}
function AssignOnClickFunctionToGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let grid = document.getElementById(`X_${j}_Y_${i}`)
            if (gridBoardArray[i][j] > 8) {
                grid.onclick = RevealBombGrid
                continue
            }
            if (gridBoardArray[i][j] == 0) {
                grid.onclick = RevealEmptyGrid
                grid.innerHTML = ""
                continue
            }
            grid.onclick = RevealNormalGrid
        }
    }
}
function RevealNormalGrid() {
    if (isGameOver == true) { return }
    if (this.classList.contains("flagged")) {
        if (isRevealingNearbyGrid) {
            return
        }
        this.classList.remove("flagged")
        this.innerHTML = ""
        bomb++
        setMineCount(bomb)
        return
    }
    let grid = this
    let gridID = grid.id.split("_")
    let x = gridID[1]
    let y = gridID[3]
    grid.innerHTML = gridBoardArray[y][x]
    RevealGrid(this)
}
function RevealEmptyGrid() {
    if (isGameOver == true) { return }
    if (this.classList.contains("flagged")) {
        if (isRevealingNearbyGrid) {
            return
        }
        this.classList.remove("flagged")
        this.innerHTML = ""
        bomb++
        setMineCount(bomb)
        return
    }
    RevealGrid(this)
    let gridTargetArray = gridBoardMap.get(this)
    gridBoardMap.delete(this)
    isRevealingNearbyGrid = true
    for (let i = 0; i < gridTargetArray.length; i++) {
        if (gridTargetArray[i].onclick == null) { continue }

        gridTargetArray[i].onclick()
    }
}
function RevealBombGrid() {
    if (isGameOver == true) {
        return
    }
    if (this.classList.contains("flagged")) {
        if (isRevealingNearbyGrid) {
            return
        }
        this.classList.remove("flagged")
        this.innerHTML = ""
        bomb++
        setMineCount(bomb)
        return
    }
    RevealGrid(this)
    GameOver()
}
function GameOver() {
    mineLeftDisplay.innerHTML = "L"
    if (unrevealedGrid == rows * cols - 1) {
        mineLeftDisplay.innerHTML = "Big L 💀"
    }
    RevealAll()
    isGameOver = true
}
function RevealGrid(grid) {
    unrevealedGrid--
    grid.onclick = null
    grid.oncontextmenu = null
    grid.classList.replace("hidden", "revealed")
    this.onclick = EmptyFunction
    setMineCount(bomb)
    if (unrevealedBombGrid == unrevealedGrid) {
        mineLeftDisplay.innerHTML = "W"
    }
}
function FlaggingGrid(event) {
    if (isGameOver) { return }
    event.preventDefault()
    if (this.classList.contains("flagged")) {
        this.classList.remove("flagged")
        this.innerHTML = ""
        bomb++
    } else {
        this.classList.add("flagged")
        this.innerHTML = "+"
        bomb--
    }
    setMineCount(bomb)
}
function EmptyFunction() {
}
function ClearGridBoard() {
    const parent = gridBoardHTML
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
}
function Initiate(difficulty) {
    isGameOver = false
    currentDifficulty = difficulty

    rows = currentDifficulty.rows
    cols = currentDifficulty.cols
    bomb = currentDifficulty.bomb
    unrevealedGrid = rows * cols
    unrevealedBombGrid = bomb
    gridBoardArray = []
    gridBoardMap = new Map()
    ClearGridBoard()
    CreateGridBoard()
    setMineCount(bomb)
    CreateBombInGridBoardArray()
    CreateGridBoardMap()
    AssignOnClickFunctionToGrid()
}
Initiate(classic)

let newGameButton = document.getElementById("newGame")

let newGameDiff = classic

let classicButton = document.getElementById("classic")
let easyButton = document.getElementById("easy")
let mediumButton = document.getElementById("medium")
let expertButton = document.getElementById("expert")


classicButton.onclick = () => { newGameDiff = classic }
easyButton.onclick = () => { newGameDiff = easy }
mediumButton.onclick = () => { newGameDiff = medium }
expertButton.onclick = () => { newGameDiff = expert }

newGameButton.onclick = () => {
    Initiate(newGameDiff)
}

function setMineCount(count) {
    mineLeftDisplay.innerHTML = `Mine left: ${count}`
}
let gridArray = document.getElementsByClassName("grid")

function RevealAll() {
    for (let i = 0; i < gridArray.length; i++) {
        const element = gridArray[i];
        RevealGridInTheEnd(element)
    }
}
function RevealGridInTheEnd(grid) {
    if (grid.classList.contains("flagged") && grid.classList.contains("bomb")) {
        grid.innerHTML = "<+>"
        return
    }
    if (grid.classList.contains("flagged") && !grid.classList.contains("bomb")) {
        return
    }
    if (!grid.classList.contains("flagged") && grid.classList.contains("bomb")) {
        if (!grid.classList.contains("revealed")) {
            grid.classList.remove("hidden")
            grid.classList.add("revealed")
        }
        grid.innerHTML = "<>"
        return
    }
    if (grid.onclick == null) { return }
}