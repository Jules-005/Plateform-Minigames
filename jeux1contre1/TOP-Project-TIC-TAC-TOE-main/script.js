
const playerFuctory = (id, secondId) => {
    this.id = id
    const playerContariner = document.querySelector(`#${id}`);
    const secondPlayerContainer = document.querySelector(`#${secondId}`);
    const score = playerContariner.querySelector('.score p');
    const nameContainer = playerContariner.querySelector('.menu-name');
    const shapeButton = playerContariner.querySelector('.shape-container button');
    let playerName = playerContariner.querySelector('.menu-name h2').textContent;
    const resultPara = document.querySelector('.result-para');

    const init = () => {
        renderName()
        addEvent()
    }
    const changeShape = () => {
        const classToggle = (el, ...args) => args.map(e => el.classList.toggle(e))
        const shape = playerContariner.querySelector('.shape span');
        const secondPlayerShape = secondPlayerContainer.querySelector('.shape span');
        if (shape.classList.contains('o')) {
            shape.textContent = 'x'
            classToggle(shape, 'o', 'x')
            secondPlayerShape.textContent = 'O'
            classToggle(secondPlayerShape, 'o', 'x')
        }
        else {
            shape.textContent = 'O'
            classToggle(shape, 'o', 'x')
            secondPlayerShape.textContent = 'X'
            classToggle(secondPlayerShape, 'o', 'x')
        }
    }
    shapeButton.addEventListener('click', changeShape)
    const renderName = () => {
        nameContainer.innerHTML = `<h2 class = "name">${playerName}</h2>
        <button id="edit-player-1"><img  src="img/edit.png" alt="Edit player name"></button>`
        addEvent()
    }
    const updateScore = () => {
        score.textContent = +score.textContent + 1
    }
    const getTurn = () => {
        if (secondPlayerContainer.querySelector('.menu-name h2').classList.contains('turn')) {
            secondPlayerContainer.querySelector('.menu-name h2').classList.toggle('turn')
        }

        const playNameHeader = playerContariner.querySelector('.menu-name h2')
        if (!playNameHeader.classList.contains('turn')) {
            playNameHeader.classList.toggle('turn')
        }

        resultPara.textContent = 'It is ' + playNameHeader.textContent + "'s turn"
        if (!playNameHeader.classList.contains('turn')) {
            resultPara.textContent = '';
        }
        const robot = playerContariner.querySelector('.robot-button');
        if (robot.classList.contains('current')) {
            gameBoard.startUiGame()
            const playerName = playerContariner.id;
            if (playerName === 'player-2') {
                player1.getTurn()
            }
            if (playerName === 'player-1') {
                player2.getTurn()
            }
        }

    }
    const useTurn = () => {
        playerContariner.querySelector('.menu-name h2').classList.toggle('turn');
        secondPlayerContainer.querySelector('.menu-name h2').classList.toggle('turn');
        resultPara.textContent = 'It is ' + secondPlayerContainer.querySelector('.menu-name h2').textContent + "'s turn"
        const playerName = playerContariner.id;
            if (playerName === 'player-2') {
                player1.getTurn()
            }
            if (playerName === 'player-1') {
                player2.getTurn()
            }
    }
    const saveNewName = () => {
        const newName = playerContariner.querySelector('.name-change-input').value
        playerName = newName
        renderName()
    }
    const changeName = () => {
        nameContainer.innerHTML = `<div class="new-name"><input type ="text" placeholder="New Name" class = "name-change-input"></input>  <div class="change-name-menu">
        <button class="save-name">Save</button>
        <button class="cancel-name">Cancel</button>
    </div></div>`
        const cancelBtn = playerContariner.querySelector('.cancel-name');
        const saveBtn = playerContariner.querySelector('.save-name');
        cancelBtn.addEventListener('click', renderName)
        saveBtn.addEventListener('click', saveNewName)
    }

    const addEvent = () => {
        const changeBtn = playerContariner.querySelector('.menu-name button')
        changeBtn.addEventListener('click', changeName)
    }
    init()

    return { updateScore, changeName, getTurn, useTurn }
}
const player1 = playerFuctory('player-1', 'player-2')
const player2 = playerFuctory('player-2', 'player-1')

const gameBoard = (() => {
    const resultPara = document.querySelector('.result-para');
    let board = ['', '', '', '', '', '', '', '', ''];
    const startGameButton = document.querySelector('.start-button');
    const cells = document.querySelectorAll('.cell');

    const playerWon = function (playerNode) {
        const showenPlayerName = playerNode.querySelector('.menu-name h2').textContent;
        cells.forEach((cell) => {
            cell.removeEventListener('click', fillCell)
        })
        const playerName = playerNode.id;
        if (playerName === 'player-2') {
            player2.updateScore()
        }
        if (playerName === 'player-1') {
            player1.updateScore()
        }
        resultPara.textContent = "The Winner is: " + showenPlayerName + "!"
        startGameButton.textContent = 'Play Again?';

    }



    function beginCellEvent() {
        cells.forEach((cell) => {
            cell.addEventListener('click', fillCell)
        })
    }
    function randomNum(number) {
        return Math.floor(Math.random() * number)
    }
    function start() {
        startGameButton.textContent = 'Start Game'
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
        renderBoard()
        random = randomNum(2);
        if (random === 0) {
            player1.getTurn()
        }
        else { player2.getTurn() }
        beginCellEvent()
    }

    function passTurn(playerNode) {
        const playerName = playerNode.id;
        if (playerName === 'player-2') {
            player2.useTurn()
        }
        if (playerName === 'player-1') {
            player1.useTurn()
        }
    }
    function fillCell() {
        const currentPlay = document.querySelector('.turn')
        const currentPlayerObj = currentPlay.parentNode.parentNode
        if (currentPlayerObj.querySelector('.shape span').textContent === 'x') {
            if (board[this.getAttribute('data-cellplace')] === '') {
                board[this.getAttribute('data-cellplace')] = 'x';
                renderBoard()

                passTurn(currentPlayerObj)
            }

        }
        else {
            if (board[this.getAttribute('data-cellplace')] === '') {
                board[this.getAttribute('data-cellplace')] = 'o';
                renderBoard()

                passTurn(currentPlayerObj)
            }
        }
        if (checkForWinner()) {
            playerWon(currentPlayerObj)
        }
        if (!checkForWinner() && !board.includes('')) {
            resultPara.textContent = "It is a draw!";
            startGameButton.textContent = 'Play Again?';
        }
    }

    const checkForWinner = () => {
        for (let i = 0; i < 7; i += 3) {
            if (board[i] === board[i + 1] && board[i] === board[i + 2] && board[i] !== '') {
                return true
            }
        }
        for (let i = 0; i < 3; i++) {
            if (board[i] === board[i + 3] && board[i] === board[i + 6] && board[i] !== '') {
                return true
            }
        }
        if (board[0] === board[4] && board[4] === board[8] && board[4] !== '' || board[2] === board[4] && board[4] === board[6] && board[4] !== '') {
            return true
        }
        return false
    }

    const startUiGame = () => {
        if (board.includes('')) {
            let i = 0;
            let random;
            let randomForCSS;
            do {
                random = randomNum(9);
                randomForCSS = random + 1
                let randomCell = document.querySelector(`.cell:nth-child(${randomForCSS})`)
                if (board[random] === '') {
                    randomCell.click()
                    break
                }
                i++
            } while (i < 6);
        }

    }

    startGameButton.addEventListener('click', start)
    const renderBoard = () => {
        for (let i = 0; i < board.length; i++) {
            const cell = document.querySelector(`#cell-${i}`);
            if (board[i] === 'o') {
                cell.innerHTML = '<span class="o">o</span>'
            }
            else if (board[i] === 'x') {
                cell.innerHTML = '<span class="x">x</span>'
            }
            else cell.innerHTML = '';

        }
    }
    return { renderBoard, checkForWinner, startUiGame }
})()

const uiMode = (() => {
    let previousName = 'Player';
    const robotButtons = document.querySelectorAll('.robot-button');
    const humanButtons = document.querySelectorAll('.human-button');

    robotButtons.forEach((robotButton) => {
        robotButton.addEventListener('click', startUiMode)
    })

    humanButtons.forEach((humanButton) => {
        humanButton.addEventListener('click', startManualMode)
    })

    function startUiMode() {
        const modeMenu = this.parentNode.parentNode;
        const nameNode = modeMenu.parentNode.querySelector('.name');
        const nodeID = modeMenu.parentNode.id
        if (nodeID === 'player-1') {
            document.querySelector('#player-2 .human-button').click()
        }
        else {document.querySelector('#player-1 .human-button').click()}
        previousName = nameNode.textContent;
        const robot = modeMenu.querySelector('.robot-button');
        const human = modeMenu.querySelector('.human-button');
        if (!robot.classList.contains('current')) { robot.classList.add('current') }
        human.classList.remove('current');
        nameNode.textContent = 'Robo'
    }
    function startManualMode() {
        const modeMenu = this.parentNode.parentNode;
        const nameNode = modeMenu.parentNode.querySelector('.name');
        const robot = modeMenu.querySelector('.robot-button');
        const human = modeMenu.querySelector('.human-button');
        if (!human.classList.contains('current')) { human.classList.add('current') }
        robot.classList.remove('current');
        nameNode.textContent = previousName;
    }

})()
