let gridBoardHTML = document.getElementById("gridBoard")
let gridBoardArray = []
let rows = 50
let cols = 50

const EMPTY = " "
const PIECE = "o"
const SELECTEDPIECE = "O"
const TARGET = "x"

class Pos {
    constructor(posX, posY) {
        this.posX = posX
        this.posY = posY
    }
}

let selectedPiece = null
let targetSquarePos = []

function CreateGridBoard() {
    for (let i = 0; i < rows; i++) {
        const rows = document.createElement("tr")
        gridBoardArray[i] = []
        for (let j = 0; j < cols; j++) {
            const grid = document.createElement("td")
            grid.setAttribute("id", `X_${j}_Y_${i}`)
            grid.className = "grid"
            grid.onclick = GridClickHandler
            rows.appendChild(grid)
            gridBoardArray[i][j] = EMPTY
        }
        gridBoardHTML.appendChild(rows)
    }
}

function FillBoard() {
    //Fill the bottom half of the board with piece
    for (let i = 6; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            Render(PIECE, j, i)
        }
    }
}
function GridClickHandler() {
    let gridId = this.id
    let gridIdSplit = gridId.split("_")
    let gridPosX = Number(gridIdSplit[1])
    let gridPosY = Number(gridIdSplit[3])
    let gridState = gridBoardArray[gridPosY][gridPosX]
    switch (gridState) {
        case EMPTY:
            if (selectedPiece == null) { break }
            Render(PIECE, selectedPiece.posX, selectedPiece.posY)
            break
        case PIECE:
            if (selectedPiece != null) {
                Render(PIECE, selectedPiece.posX, selectedPiece.posY)
            }
            Render(SELECTEDPIECE, gridPosX, gridPosY)
            break
        case SELECTEDPIECE:
            Render(PIECE, gridPosX, gridPosY)
            ClearTargetGrid()
            selectedPiece = null
            break
        case TARGET:
            MovePiece(selectedPiece.posX, selectedPiece.posY, gridPosX, gridPosY)
            break
    }
}
function ClearTargetGrid(){
    for (let i = 0; i < targetSquarePos.length; i++) {
        if (gridBoardArray[targetSquarePos[i].posY][targetSquarePos[i].posX] == TARGET) {
            Render(EMPTY, targetSquarePos[i].posX, targetSquarePos[i].posY)
        }
    }
    targetSquarePos = []
}
function CheckForLegalMove(posX, posY) {
    for (let offsetX = -1; offsetX < 2; offsetX++) {
        for (let offsetY = -1; offsetY < 2; offsetY++) {
            // if (Math.abs(offsetX) - Math.abs(offsetY) == 0) { continue }

            if (posX + offsetX * 2 < 0 || posX + offsetX * 2 >= cols) { continue }
            if (posY + offsetY * 2 < 0 || posY + offsetY * 2 >= rows) { continue }

            let dieGrid = gridBoardArray[posY + offsetY][posX + offsetX]
            let targetGrid = gridBoardArray[posY + offsetY * 2][posX + offsetX * 2]
            if (dieGrid == PIECE && targetGrid == EMPTY) {
                Render(TARGET, posX + offsetX * 2, posY + offsetY * 2)
            }
        }
    }

}
function MovePiece(piecePosX, piecePosY, targetPosX, targetPosY) {
    let killPosOffsetX = (targetPosX - piecePosX) / 2
    let killPosOffsetY = (targetPosY - piecePosY) / 2
    let killPosX = piecePosX + killPosOffsetX
    let killPosY = piecePosY + killPosOffsetY

    Render(EMPTY, piecePosX, piecePosY)
    Render(EMPTY, killPosX, killPosY)
    Render(SELECTEDPIECE, targetPosX, targetPosY)
}
function Init() {
    CreateGridBoard()
    FillBoard()
}
function Render(state, posX, posY) {
    let grid = document.getElementById(`X_${posX}_Y_${posY}`)
    gridBoardArray[posY][posX] = state
    switch (state) {
        case EMPTY:
            grid.className = "grid"
            break
        case PIECE:
            grid.className = "grid piece"
            break
        case SELECTEDPIECE:
            if (selectedPiece != null && gridBoardArray[selectedPiece.posY][selectedPiece.posX] == SELECTEDPIECE) {
                Render(PIECE, selectedPiece.posX, selectedPiece.posY)
            }
            grid.className = "grid piece selected"
            selectedPiece = new Pos(posX, posY)
            ClearTargetGrid()
            CheckForLegalMove(posX, posY)
            break
        case TARGET:
            grid.className = "grid target"
            targetSquarePos[targetSquarePos.length] = new Pos(posX, posY)
            console.log(targetSquarePos)
            break
    }
}
Init()