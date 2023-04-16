const gridBoardHTML = document.getElementById("gridBoard")
let gridBoardEmptyState = []
let gridBoardFilledState = []
let gridBoardNextState = []
let gridBoardCurrentState = []
let empty = false
let isPlaying = false
let autoPlayIntervalID

let browserWidth = window.innerWidth
let rows = 50
let cols = 70
let canEditGrid = true

const nextGenButton = document.getElementById("nextGen")
nextGenButton.onclick = () => {
  clearInterval(autoPlayIntervalID)

  NextGeneration()
}

const emptyBoardButton = document.getElementById("resetGrid")
emptyBoardButton.onclick = () => {
  clearInterval(autoPlayIntervalID)
  AssignState(gridBoardEmptyState)
}

const resetBoardButton = document.getElementById("randomSeed")
resetBoardButton.onclick = () => {
  AssignState(gridBoardEmptyState)
  clearInterval(autoPlayIntervalID)
  RandomlyAssignState()
}

const autoPlayButton = document.getElementById("autoPlay")
autoPlayButton.onclick = () => {
  if (isPlaying == true) {
    clearInterval(autoPlayIntervalID)
    isPlaying = false
    return
  }

  autoPlayIntervalID = setInterval(NextGeneration, 100)
  isPlaying = true
}

function initiate() {
  createGridBoard()
  RandomlyAssignState()
}

function createGridBoard() {
  for (let i = 0; i < rows; i++) {
    const rows = document.createElement("tr")

    gridBoardEmptyState[i] = []
    gridBoardFilledState[i] = []
    gridBoardNextState[i] = []
    gridBoardCurrentState[i] = []

    for (let j = 0; j < cols; j++) {

      const grid = document.createElement("td")
      grid.setAttribute("id", `X_${j}_Y_${i}`)
      grid.setAttribute("class", "grid dead")
      rows.appendChild(grid)
      grid.onclick = GridClickHandler

      gridBoardEmptyState[i][j] = 0
      gridBoardFilledState[i][j] = 1
      gridBoardNextState[i][j] = 0
      gridBoardCurrentState[i][j] = 0

    }
    gridBoardHTML.appendChild(rows)
  }
}

function CountNeighbour(gridPosX, gridPosY) {
  let neighbourAmount = 0
  for (let i = gridPosX - 1; i <= gridPosX + 1; i++) {
    for (let j = gridPosY - 1; j <= gridPosY + 1; j++) {
      let neighbourState = GetGridStateByPos(i, j)

      neighbourAmount += neighbourState
    }
  }
  neighbourAmount -= GetGridStateByPos(gridPosX, gridPosY)
  ApplyConwayRule(gridPosX, gridPosY, neighbourAmount)
}

function GetGridStateByPos(gridPosX, gridPosY) {
  if (gridPosX < 0 || gridPosX > cols - 1 || gridPosY < 0 || gridPosY > rows - 1) { return 0 }
  return gridBoardCurrentState[gridPosY][gridPosX]
}

function SetGridStateByPos(gridPosX, gridPosY, state) {
  if (state == gridBoardCurrentState[gridPosY][gridPosX]) { return }
  let targetNeighbour = document.getElementById(`X_${gridPosX}_Y_${gridPosY}`)

  if (targetNeighbour === null) { return }
  gridBoardCurrentState[gridPosY][gridPosX] = state
  if (state == 0) {
    targetNeighbour.className = "grid dead"
    return
  }
  targetNeighbour.className = "grid alive"
}

function ApplyConwayRule(gridPosX, gridPosY, neighbourAmount) {
  let gridState = GetGridStateByPos(gridPosX, gridPosY)
  if (neighbourAmount == 3) {
    gridBoardNextState[gridPosY][gridPosX] = 1
    //
    amountOfCellAlive++
    if (gridBoardNextState[gridPosY][gridPosX] == 1 && gridBoardCurrentState[gridPosY][gridPosX] == 0) {
      amountOfCellBorn++
    }
    //
    return
  }
  if (neighbourAmount == 2) {
    gridBoardNextState[gridPosY][gridPosX] = gridState
    //
    if (gridState == 1) {
      amountOfCellAlive++
      if (gridBoardNextState[gridPosY][gridPosX] == 1 && gridBoardCurrentState[gridPosY][gridPosX] == 0) {
        amountOfCellBorn++
      }
    } else if (gridState == 0) {
      amountOfCellDead++
      if (gridBoardNextState[gridPosY][gridPosX] == 0 && gridBoardCurrentState[gridPosY][gridPosX] == 1) {
        amountOfCellKilled++
      }
    }
    //
    return
  }

  gridBoardNextState[gridPosY][gridPosX] = 0
  //
  amountOfCellDead++
  if (gridBoardNextState[gridPosY][gridPosX] == 0 && gridBoardCurrentState[gridPosY][gridPosX] == 1) {
    amountOfCellKilled++
  }
  //
  return
}

function RandomlyAssignState() {
  isPlaying = false
  for (let i = 0; i < Math.floor(rows * cols * 0.4); i++) {
    let x, y
    do {
      x = Math.floor(Math.random() * cols)
      y = Math.floor(Math.random() * rows)
      let gridState = GetGridStateByPos(x, y)

      if (gridState == 0) {
        SetGridStateByPos(x, y, 1)
        break;
      }
    } while (true);
  }
}

function AssignState(state) {
  for (i = 0; i < state.length; i++) {
    for (j = 0; j < state[i].length; j++) {
      SetGridStateByPos(j, i, state[i][j])
    }
  }
}
//
class Result {
  constructor(amountOfCellAlive, amountOfCellBorn, amountOfCellDead, amountOfCellKilled) {
    this.amountOfCellAlive = amountOfCellAlive
    this.amountOfCellBorn = amountOfCellBorn
    this.amountOfCellDead = amountOfCellDead
    this.amountOfCellKilled = amountOfCellKilled
  }
}
//

function NextGeneration() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      CountNeighbour(i, j)
    }
  }
  AssignState(gridBoardNextState)
  //
  console.log(`Amount of cell alive is  ${amountOfCellAlive}\n\A  mount of cell dead is   ${amountOfCellDead}\n\Amount of cell born is   ${amountOfCellBorn}\n\Amount of cell killed is ${amountOfCellKilled}`)
  amountOfCellAlive = 0
  amountOfCellBorn = 0
  amountOfCellDead = 0
  amountOfCellKilled = 0
  //
}

function GridClickHandler() {
  clearInterval(autoPlayIntervalID)
  let gridID = this.id
  let gridSplitedID = gridID.split("_")
  let gridPosX = gridSplitedID[1]
  let gridPosY = gridSplitedID[3]
  let classes = this.getAttribute("class");
  isPlaying = false
  if (classes == "grid dead") {
    this.setAttribute("class", "grid alive")
    gridBoardCurrentState[gridPosY][gridPosX] = 1
    return
  }
  this.setAttribute("class", "grid dead")
  gridBoardCurrentState[gridPosY][gridPosX] = 0
}
// if (browserWidth >= 1200) {
//   rows = 50
//   cols = 125  
// } else if (browserWidth >= 992) {
//   rows = 40
//   cols = 90
// } else if (browserWidth >= 768) {
//   rows = 30
//   cols = 70
// } else if (browserWidth >= 600) {
//   canEditGrid = false
//   rows = 20
//   cols = 50
// } else if (browserWidth >= 418) {
//   canEditGrid = false
//   rows = 20
//   cols = 35
// } else if (browserWidth >= 375) {
//   canEditGrid = false
//   rows = 20
//   cols = 30
// } else {
//   canEditGrid = false
//   rows = 20
//   cols = 20
// }
initiate()

//Funsy :)
let amountOfCellKilled = 0
let amountOfCellBorn = 0
let amountOfCellDead = 0
let amountOfCellAlive = 0

function Foo() {
  resetBoardButton.onclick()
  autoPlayButton.onclick()
}
//Foo()
//setInterval(Foo, 600000)