//I never should have made this game, abort!
//Have fun mess around though :)
document.addEventListener("keydown", (event) => {
    console.log(`Key: ${event.key}`)
    switch (event.key) {
        case "ArrowUp":
            GoUp()
            break;
        case "ArrowDown":
            GoDown()
            break;
        case "ArrowLeft":
            GoLeft()
            break;
        case "ArrowRight":
            GoRight()
            break;
    }
}, true);

let board = [
    [00, 01, 02, 03],
    [10, 11, 12, 13],
    [20, 21, 22, 23],
    [30, 31, 32, 33]
]


function GoUp() {

}
function GoDown() {

}
function GoRight() {
    for (let i = 0; i < board.length; i++) {
        const element = board[i];
        CombineLine(element[0], element[1], element[2], element[3])
    }
}
function GoLeft() {

}
function CombineLine(cell0, cell1, cell2, cell3) {
    let array = [cell0, cell1, cell2, cell3]
    let result = [0, 0, 0, 0]
    let offset = 1
    for (let i = array.length - 1; i > 0; i++) {

    }
}
function PushCellToTheEnd(cell0,cell1,cell2,cell3) {
    /*
    Push cell to the end of the array if it reach 
    the end, return success and the result
    If 
    */

}
function CombineCell(cellToCombine, hostCell) {
    if (hostCell == 0) {
        return true
    }
    if (cellToCombine == hostCell) {
        hostCell += cellToCombine
        return hostCell
    }
    return false
}