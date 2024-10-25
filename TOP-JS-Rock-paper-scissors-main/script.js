const rockElement = document.querySelector('#Rock');
const paperElement = document.querySelector('#Paper');
const scissorsElement = document.querySelector('#Scissors');

const rockElementClone = rockElement.cloneNode(true);
const rockElementClone2 = rockElement.cloneNode(true);
const paperElementClone = paperElement.cloneNode(true);
const paperElementClone2 = paperElement.cloneNode(true);
const scissorsElementClone = scissorsElement.cloneNode(true);
const scissorsElementClone2 = scissorsElement.cloneNode(true);

const playerRoundResultImg = document.querySelector('#player-choice div');
const computerRoundResultImg = document.querySelector('#computer-choice div');

function computerPlay() {
    let computerChoice
    let randomNumber = Math.floor(Math.random() * 3)
    if (randomNumber == 0) {
        computerChoice = 'Rock'
    }
    else if (randomNumber == 1) {
        computerChoice = 'Paper'
    }
    else { computerChoice = 'Scissors' }
    return computerChoice
}
function playRound(computerSelection, playerSelection) {
    playerRoundResultImg.innerHTML = '';
    computerRoundResultImg.innerHTML = '';
    let result;
    playerSelection = playerSelection.toLowerCase()
    if (playerSelection == 'rock') {
        playerRoundResultImg.append(rockElementClone);
        if (computerSelection == 'Rock') {
            result = "Draw! Rock ties with Rock"
            computerRoundResultImg.append(rockElementClone2);
        }
        else if (computerSelection == 'Paper') {
            result = "You Lose! Paper beats Rock"
            computerRoundResultImg.append(paperElementClone);
        }
        else {
            result = "You Win! Rock beats Scissors"
            computerRoundResultImg.append(scissorsElementClone);
        }

    }
    else if (playerSelection == 'paper') {
        playerRoundResultImg.append(paperElementClone);

        if (computerSelection == 'Rock') {
            result = "You Win! Paper beats Rock"
            computerRoundResultImg.append(rockElementClone);

        }
        else if (computerSelection == 'Paper') {
            result = "Draw! Paper ties with Paper"
            computerRoundResultImg.append(paperElementClone2);
        }
        else {
            result = "You Lose! Scissors beats Paper"
            computerRoundResultImg.append(scissorsElementClone);
        }

    }
    else if (playerSelection == 'scissors') {
        playerRoundResultImg.append(scissorsElementClone);

        if (computerSelection == 'Rock') {
            result = "You Lose! Rock beats Scissors"
            computerRoundResultImg.append(rockElementClone);

        }
        else if (computerSelection == 'Paper') {
            result = "You Win! Scissors beats Paper"
            computerRoundResultImg.append(paperElementClone);
        }
        else {
            result = "Draw! Scissors ties with Scissors"
            computerRoundResultImg.append(scissorsElementClone2);
        }

    }
    else { result = 'Something is wrong' }
    return result
}
const computerResult = document.querySelector('.result.computer')
const humanResult = document.querySelector('.result.human')
const buttons = document.querySelectorAll('.content button')
const finalResult = document.querySelector('#final-result')
const pageRoundResult = document.querySelector('#round-result')
const againButton = document.querySelector('.again')


let  playAndUpdateScore = function () {
    let playerSelection = this.id;
    const computerSelection = computerPlay();
    const roundResoult = playRound(computerSelection, playerSelection);
    pageRoundResult.textContent = roundResoult
    if (roundResoult.includes('You Win!')) {
        humanResult.textContent = +humanResult.textContent + 1;
        if (humanResult.textContent == 5) { finalResult.textContent = 'You Won! good game'
        finalResult.style.color = 'green';
        buttons.forEach((button) => {
            button.removeEventListener('click', playAndUpdateScore
        )
        })
        againButton.classList.remove('hidden')
    }
    }
    if (roundResoult.includes('You Lose!')) {
        computerResult.textContent = +computerResult.textContent + 1;
        if (computerResult.textContent == 5) { finalResult.textContent = 'You Lost! better luck next time'
        finalResult.style.color = 'red';
        buttons.forEach((button) => {
            button.removeEventListener('click', playAndUpdateScore
        )
        })
        againButton.classList.remove('hidden')
    }

    }
}
againButton.addEventListener('click', () => {
    againButton.classList.add('hidden')
    humanResult.textContent = 0
    computerResult.textContent = 0
    finalResult.textContent = ''
    pageRoundResult.textContent = ''
    playerRoundResultImg.innerHTML = '';
    computerRoundResultImg.innerHTML = '';
    startGame()
})
function startGame() {
   buttons.forEach((button) => {
    button.addEventListener('click', playAndUpdateScore
)
}) 
}
startGame()

function game(numberOfGames) {
    for (let i = 0; i < numberOfGames; i++) {
        function newLi() {
            return document.createElement("li");
            }

        const computerSelection = computerPlay()  
        let li = document.createElement('li');
        li.textContent = playRound(computerSelection, playerSelection) ;
        
        
    }
}


