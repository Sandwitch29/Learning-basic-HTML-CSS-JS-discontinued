const EMPTY = " "
const FOOD = "o"
const BIGFOOD = "O"
const BODY = "0"
const HEAD = "Q"
class Grid {
    constructor(x, y, state) {
        this.x = x
        this.y = y
        this.state = state
    }
}

let snakeBody = [new Grid(5, 2, BODY), new Grid(4, 2, HEAD)]
let dirX = 1
let dirY = 0

let foodCycle = 0
let foodEatenInCycle = 0
let score = 0
let bigFoodPos = null

let gridBoardArray = []
let gridBoardHTML = document.getElementById("gridBoard")
let height = 6
let width = 10

function CreateGridBoard() {
    for (let i = 0; i < height; i++) {
        const rows = document.createElement("tr")
        gridBoardArray[i] = []
        for (let j = 0; j < width; j++) {
            const grid = document.createElement("td")
            grid.setAttribute("id", `X_${j}_Y_${i}`)
            grid.setAttribute("class", "grid")
            rows.appendChild(grid)
            gridBoardArray[i][j] = EMPTY
        }
        gridBoardHTML.appendChild(rows)
    }
}
function MoveHead() {
    let headX = snakeBody[0].x
    let headY = snakeBody[0].y
    let newHeadX = headX + dirX
    let newHeadY = headY + dirY
    let tailX = snakeBody[snakeBody.length - 1].x
    let tailY = snakeBody[snakeBody.length - 1].y
    if (newHeadX < 0 || newHeadY < 0 || newHeadX >= width || newHeadY >= height || gridBoardArray[newHeadY][newHeadX] == BODY) {
        GameOver()
        return
    }
    if (gridBoardArray[newHeadY][newHeadX] == EMPTY) {
        Render(tailX, tailY, EMPTY)
        snakeBody.pop()
    }
    if (gridBoardArray[newHeadY][newHeadX] == FOOD) {
        EatFood(FOOD)
    }
    if (gridBoardArray[newHeadY][newHeadX] == BIGFOOD) {
        EatFood(BIGFOOD)
    }
    snakeBody.unshift(new Grid(newHeadX, newHeadY, HEAD))
    Render(headX, headY, BODY)
    Render(newHeadX, newHeadY, HEAD)
}
function Initiate() {
    CreateGridBoard()
    RenderSnake()
    SpawnNewFood(FOOD)
}
function GameOver() {
    clearInterval(startGameIntervalId)
}
function Render(x, y, state) {
    let grid = document.getElementById(`X_${x}_Y_${y}`)
    gridBoardArray[y][x] = state

    switch (state) {
        case EMPTY:
            grid.className = "grid"
            break
        case FOOD:
            grid.className = "grid food"
            break
        case BIGFOOD:
            grid.className = "grid bigFood"
            break
        case BODY:
            grid.className = "grid snakeBody"
            break
        case HEAD:
            grid.className = "grid snakeHead"
            break
    }
}
function RenderSnake() {
    Render(snakeBody[0].x, snakeBody[0].y, HEAD)
    for (let i = 1; i < snakeBody.length; i++) {
        Render(snakeBody[i].x, snakeBody[i].y, BODY)
    }
}
function EatFood(foodType) {
    if (foodType == FOOD) {
        IncreaseScore(currentDifficulty)
        foodEatenInCycle++
        SpawnNewFood(FOOD)
        if (foodEatenInCycle == foodCycle + 5) {
            SpawnNewFood(BIGFOOD)
        }
    }
    if (foodType == BIGFOOD) {
        foodEatenInCycle = 0
        foodCycle++
        IncreaseScore(bigFoodScore)
        bigFoodBarBackground.classList.add("disabled")
        clearInterval(bigFoodIntervalId)
        bigFoodBar.style.width = "100%"
        bigFoodPos = null
    }
}
let scoreDiv = document.getElementById("scoreDisplay")
function IncreaseScore(scoreToAdd) {
    if (scoreToAdd == false) {
        scoreDiv.innerText = `Score: 0`
        score = 0
        return
    }
    score += scoreToAdd
    scoreDiv.innerText = `Score: ${score}`

}
let bigFoodIntervalId
let bigFoodScore = 100
function SpawnNewFood(foodType) {
    let foodPosX = RandomNumber(0, width)
    let foodPosY = RandomNumber(0, height)
    if (gridBoardArray[foodPosY][foodPosX] != EMPTY) {
        SpawnNewFood(foodType)
        return
    }
    Render(foodPosX, foodPosY, foodType)
    if (foodType == BIGFOOD) {
        bigFoodIntervalId = setInterval(ReduceBigFoodScore, (11 - currentDifficulty) * 100)
        bigFoodPos = new Grid(foodPosX, foodPosY, foodType)
        bigFoodScore = 100
        bigFoodBar.style.width = "100%"
        bigFoodBarBackground.classList.remove("disabled")
    }
}
let bigFoodBar = document.getElementById("bigFoodBar")
function ReduceBigFoodScore() {
    if (bigFoodScore == 0) {
        clearInterval(bigFoodIntervalId)
        Render(bigFoodPos.x, bigFoodPos.y, bigFoodPos.state)
        bigFoodPos = null
        bigFoodBarBackground.classList.add("disabled")
        return
    }
    bigFoodScore -= 5
    bigFoodBar.style.width = `${bigFoodScore}%`
}
function RandomNumber(min, max) {
    return Math.round(min + Math.random() * (max - min - 1));
}
function KeyPressCheck(event) {
    let key = event.key
    let newDirX = 0
    let newDirY = 0
    switch (key) {
        case "w":
            newDirY = -1
            break
        case "d":
            newDirX = 1
            break
        case "s":
            newDirY = 1
            break
        case "a":
            newDirX = -1
            break
    }
    if (Math.abs(newDirX) + Math.abs(dirX) == 2 || Math.abs(newDirY) + Math.abs(dirY) == 2) {
        return
    }
    dirX = newDirX
    dirY = newDirY
}
function StartNewGame() {
    clearInterval(startGameIntervalId)
    snakeBody = [new Grid(5, 2, BODY), new Grid(4, 2, HEAD)]
    dirX = 1
    dirY = 0
    foodCycle = 0
    foodEatenInCycle = 0
    score = 0
    isInGame = false
    isPlaying = false
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            Render(j, i, EMPTY)
        }
    }
    if (bigFoodPos != null) {
        bigFoodBarBackground.classList.add("disabled")
        clearInterval(bigFoodIntervalId)
        bigFoodBar.style.width = "100%"
    }
    IncreaseScore(false)
    RenderSnake()
    SpawnNewFood(FOOD)

}
Initiate()

let difficulty = 1
let currentDifficulty = 10
let isPlaying = false
let isInGame = false
let startGameIntervalId

const playButton = document.getElementById("play")
playButton.onclick = () => {
    if (!isInGame) {
        isInGame = true
        isPlaying = true
        currentDifficulty = difficulty
        startGameIntervalId = setInterval(MoveHead, (11 - currentDifficulty) * 100)
    } else if (isPlaying) {
        clearInterval(startGameIntervalId)
        isPlaying = false
    } else {
        startGameIntervalId = setInterval(MoveHead, (11 - currentDifficulty) * 100)
        isPlaying = true
    }

}
const newGameButton = document.getElementById("newGame")
newGameButton.onclick = () => {
    StartNewGame()
}
const diffSlider = document.getElementById("diffSlider")
diffSlider.oninput = function () {
    difficulty = Number(this.value)
}