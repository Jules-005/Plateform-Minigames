/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A',];
const unshuffledDeck = buildUnshuffledDeck();

/*----- state variables -----*/
let shuffledDeck;
let player;
let dealer;
let outcome; // pBlackjackW, pWin, pLose, push
let wallet;
let winnings;

/*----- cached elements  -----*/
const userCardsEl = document.getElementById('u-cards');
const dealerCardsEl = document.getElementById('d-cards');
const wagerInputEl = document.getElementById('wager-input');
const msgEl = document.getElementById('display-msg');
const walletEl = document.getElementById('wallet-info');
const playAgainBtn = document.getElementById('play-again');
const newCard = document.createElement('div');

/*----- event listeners -----*/
document.getElementById('stay-btn').addEventListener('click', handleStay);
document.getElementById('wager-btn').addEventListener('click', function (evt) {
    evt.preventDefault();
    handleWager();
});
document.getElementById('dark-mode-checkbox').addEventListener('change', handleDarkMode)
document.getElementById('hit-btn').addEventListener('click', handleHit);
document.getElementById('rules-btn').addEventListener('click', toggleRules);
playAgainBtn.addEventListener('click', function () {
    document.querySelector('form').style.display = 'flex';
    playAgainBtn.innerText = 'Prochain jeu'
    msgEl.innerText = '';
    msgEl.style.display = 'block';
    playAgainBtn.style.visibility = 'hidden';
    stayNextSound();
    init();
});
/*----- functions -----*/
init();

function init() {
    shuffledDeck = shuffleNewDeck();
    player = {
        hand: [],
        imgLookup: [],
        handVal: 0,
        wager: 0
    }
    dealer = {
        hand: [],
        imgLookup: [],
        handVal: 0
    }
    outcome = null;
    wallet = wallet || 200;
    render();
}

function checkBlackjack() {
    getHandTotal(dealer);
    getHandTotal(player);

    if (player.handVal === 21 && dealer.handVal === 21) {
        outcome = 'push';
    }
    else if (player.handVal === 21) {
        outcome = 'pBlackjackW';
    }
    else if (dealer.handVal === 21) {
        outcome = 'pBlackjackL';
    }
    updateWallet();
    render();
}

function checkBust() {
    getHandTotal(player);
    if (player.handVal > 21) {
        outcome = 'pLose';
        hideControls();
    }
    updateWallet();
    render();
}

function checkOutcome() {
    getHandTotal(player);
    getHandTotal(dealer);
    if (player.handVal > 21) {
        outcome = 'pLose'
    } else if (dealer.handVal > 21) {
        outcome = 'pWin';
    } else if (player.handVal > dealer.handVal) {
        outcome = 'pWin';
    } else if (player.handVal === dealer.handVal) {
        outcome = 'push';
    } else {
        outcome = 'pLose';
    }
    document.getElementById('hit-btn').style.display = 'none';
    document.getElementById('stay-btn').style.display = 'none';
    updateWallet();
    render();
}

function dealCards(amount, user) {
    for (let i = 0; i < amount; i++) {
        let nextCard = shuffledDeck.shift();
        user.hand.push(nextCard.value);
        user.imgLookup.push(nextCard.face);
    }
}

function getHandTotal(user) {
    user.handVal = 0;
    aceCount = 0;
    user.hand.forEach(function (card, idx) {
        user.handVal += card;
        if (card === 11) {
            aceCount++;
        }
        while (aceCount && user.handVal > 21) {
            user.handVal -= 10;
            aceCount--;
        }
    })
    return user.handVal;
}

function handleHit() {
    clickSound();
    dealCards(1, player);
    checkBust();
}

function handleStay() {
    hideControls();
    while (getHandTotal(dealer) < 17) {
        dealCards(1, dealer);
    }
    checkOutcome();
}

function handleWager() {
    const wagerAmt = parseFloat(wagerInputEl.value);
    if (wagerAmt > wallet) {
        clickErrorSound();
        msgEl.style.color = '#CD1818';
        msgEl.innerText = `Entrée une mise valide\nCurrent balance: $${wallet}`;
    } else if (wagerAmt < 0) {
        clickErrorSound();
        msgEl.style.color = '#CD1818';
        msgEl.innerText = 'Entrée une mise valide';
    }
    else {
        msgEl.innerText = '';
        player.wager = wagerAmt;
        dealCards(2, player);
        dealCards(2, dealer);
        checkBlackjack();
        wagerSound();
        document.querySelector('form').style.display = 'none';
        showControls();
    }
    document.querySelector('ul').classList.add('hidden');
}

function hideControls() {
    document.getElementById('hit-btn').style.display = 'none';
    document.getElementById('stay-btn').style.display = 'none';
}

function showControls() {
    document.getElementById('hit-btn').style.display = 'block';
    document.getElementById('stay-btn').style.display = 'block';
}

function toggleRules() {
    document.querySelector('ul').classList.toggle('hidden');
}

function updateWallet() {
    if (outcome === 'pWin') {
        wallet += player.wager;
    } else if (outcome === 'pBlackjackW') {
        wallet += player.wager * 1.5;
    } else if (outcome === 'pLose' || outcome === 'pBlackjackL') {
        wallet -= player.wager;
    }
    if (wallet === 0) {
        playAgainBtn.innerHTML = 'Tu n as plus de crédits. Relance la page et réesaye';
    }
}

function render() {
    renderCards();
    renderWalletMsg();
    if (outcome) {
        renderWinner();
    }
}

function renderCards() {
    userCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    player.imgLookup.forEach(function (face) {
        userCardsEl.innerHTML += `<div class="card ${face} u-xlarge shadow"></div>`;
    })
    dealer.imgLookup.forEach(function (face) {
        if (face === dealer.imgLookup[0]) {
            dealerCardsEl.innerHTML += `<div id="down" class="card back-red d-xlarge shadow"></div>`;
        } else {
            dealerCardsEl.innerHTML += `<div class="card ${face} d-xlarge shadow"></div>`;
        }
    })
}

function renderWalletMsg() {
    const wagerEl = document.getElementById('wager-amt');
    const walletEl = document.getElementById('wallet-amt');
    wagerEl.innerText = `Mise: $${player.wager}`;
    walletEl.innerText = `Portefeuille: $${wallet}`;
}

function renderWinner() {
    playAgainBtn.classList.remove('hidden');
    playAgainBtn.style.visibility = 'visible';
    const faceDownCard = document.querySelector('#down');
    faceDownCard.classList.add(`${dealer.imgLookup[0]}`);
    faceDownCard.classList.remove('back-red');
    document.getElementById('rules-list').style.visibility = 'hidden';

    if (outcome === 'pWin') {
        msgEl.style.color = '#557A46';
        msgEl.innerText = `Le joueur gagne $${player.wager}! \n(${player.handVal} à ${dealer.handVal})`;
        cashRegisterSound();
    } else if (outcome === 'pLose') {
        msgEl.style.color = '#CD1818';
        msgEl.innerText = `Le joueur perd $${player.wager}! \n(${player.handVal} à ${dealer.handVal})`;
        loseSound();
    } else if (outcome === 'pBlackjackW') {
        msgEl.style.color = '#557A46';
        cashRegisterSound();
        msgEl.innerText = `Bien joué! $${player.wager * 1.5} avec un Blackjack!`;
    } else if (outcome === 'pBlackjackL') {
        msgEl.style.color = '#CD1818';
        msgEl.innerText = `Dommage! $${player.wager} contre un Blackjack!`;
        loseSound();
    } else {
        msgEl.style.color = 'rgb(50, 50, 50)';
        msgEl.innerText = `Égalité! \n(${player.handVal} à ${dealer.handVal})`;
        drawSound();
    }
}


function buildUnshuffledDeck() {
    const deck = [];
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
            deck.push({
                face: `${suit}${rank}`,
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}

function shuffleNewDeck() {
    const tempDeck = [...unshuffledDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}

/*----- Sounds -----*/

function clickSound() {
    const snd = new Audio('sounds/click.wav');
    snd.volume = 0.3;
    snd.play();
}

function clickErrorSound() {
    const snd = new Audio('sounds/click-error.wav');
    snd.volume = 0.3;
    snd.play();
}

function cashRegisterSound() {
    const snd = new Audio('sounds/cash-register.mp3');
    snd.volume = 0.3;
    snd.play();
}

function loseSound() {
    const snd = new Audio('sounds/lose.mp3');
    snd.play();
}

function wagerSound() {
    const snd = new Audio('sounds/shuffle-cards.mp3');
    snd.volume = 0.3;
    snd.play();
}
function drawSound() {
    const snd = new Audio('sounds/neutral.mp3');
    snd.play();
}

function stayNextSound() {
    const snd = new Audio('sounds/stay-next.mp3');
    snd.volume = 0.1;
    snd.play();
}

function handleDarkMode(e) {
    document.querySelectorAll("#user-msg p")[0].classList.toggle("dark-mode-border", e.target.checked)
    document.querySelectorAll("#dealer-msg p")[0].classList.toggle("dark-mode-border", e.target.checked)
    document.body.classList.toggle("dark-mode", e.target.checked)
    document.getElementById('wager-btn').classList.toggle("dark-mode-btn", e.target.checked)
}