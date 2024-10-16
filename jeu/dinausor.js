let score = 0; // Score total en secondes
let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0; // Meilleur score depuis localStorage  
let isJumping = false;
let isCrouching = false;
let isGameOver = false;
let obstacleSpeed = 0.6; // Vitesse initiale des obstacles
let obstacleInterval;
const minObstacleInterval = 900;
const maxObstacleInterval = 1400;

// Variable pour savoir si l'obstacle a été passé
let isObstaclePassed = false; 
let gameStarted = false; // Indique si le jeu a commencé
let timeElapsed = 0; // Temps écoulé en secondes
let scoreInterval; // Intervalle pour mettre à jour le score
let scoreUpdated = false; // État pour savoir si le score a déjà été mis à jour à la mort

document.addEventListener('keydown', function(event) {
    const dino = document.getElementById('dino');

    if (event.code === 'Space' && !isGameOver) {
        jump();
    }

    if (event.code === 'ArrowDown' && !isGameOver) {
        crouch();
    }

    if (isGameOver && event.code === 'Enter') {
        restartGame(); // Appeler la fonction pour redémarrer le jeu
    }
});

// Écouteur d'événements pour la touche relâchée
document.addEventListener('keyup', function(event) {
    const dino = document.getElementById('dino');

    if (event.code === 'ArrowDown') {
        // Permettre de se relever après avoir relâché la touche flèche vers le bas
        if (isCrouching) {
            dino.classList.remove('crouch');
            isCrouching = false;
        }
    }
});

function checkCollision() {
    const dino = document.getElementById('dino');
    const dinoRect = dino.getBoundingClientRect();

    // Récupère tous les obstacles volants
    const flyingObstacles = document.querySelectorAll('.obstacle-flying');

    flyingObstacles.forEach((flyingObstacle) => {
        const flyingObstacleRect = flyingObstacle.getBoundingClientRect();

        // Ajustement des dimensions de l'obstacle volant
        const adjustedFlyingObstacleRect = {
            top: flyingObstacleRect.top, // Ajuster la position en haut
            bottom: flyingObstacleRect.bottom, // Position du bas
            left: flyingObstacleRect.left, // Position à gauche
            right: flyingObstacleRect.right // Position à droite
        };

        // Ajustement des dimensions du dinosaure
        const adjustedDinoRect = {
            top: dinoRect.top + 10, // Ajuste le haut de 10 pixels vers le bas
            bottom: dinoRect.bottom - 15, // Ajuste le bas de 10 pixels vers le haut
            left: dinoRect.left - 20, // Ajuste la gauche de 10 pixels vers la droite
            right: dinoRect.right - 20 // Ajuste la droite de 10 pixels vers la gauche
        };

        // Vérification de la collision
        if (
            adjustedDinoRect.right > adjustedFlyingObstacleRect.left &&
            adjustedDinoRect.left < adjustedFlyingObstacleRect.right &&
            adjustedDinoRect.bottom > adjustedFlyingObstacleRect.top &&
            adjustedDinoRect.top < adjustedFlyingObstacleRect.bottom
        ) {
            gameOver(); // Appeler la fonction gameOver si collision
        }
    });
}

// Exemple d'appel de la fonction de vérification des collisions
setInterval(checkCollision, 100); // Vérifier les collisions toutes les 100 ms
const jumpCooldown = 50; 

// Saut
function jump() {
    // Ne pas vérifier l'état de saut, permettre de spammer
    const dino = document.getElementById('dino');
    dino.classList.add('jump');

    // Toujours réinitialiser l'état du saut
    setTimeout(() => {
        dino.classList.remove('jump');
    }, 800); // Durée de l'animation CSS du saut
}

// Accroupissement
function crouch() {
    // Ne pas vérifier l'état de crouch, permettre de spammer
    const dino = document.getElementById('dino');
    if (!isCrouching) {
        isCrouching = true;
        dino.classList.add('crouch');
    }
}

function generateObstacles() {
    if (!gameStarted) return;
    const randomChance = Math.random();

    // Génération d'obstacles selon des probabilités
    if (randomChance < 0.1) { // 10% chance to create a flying obstacle (modifié à 10%)
        createFlyingObstacle(); // Créer un oiseau
    } else if (randomChance < 0.3) {
        createObstacle(); // Créer un obstacle normal
        setTimeout(createObstacle, 70); // Création d'un autre obstacle après 70ms
    } else if (randomChance < 0.45) {
        createObstacle(); // Créer un obstacle normal
        setTimeout(createObstacle, 100);
        setTimeout(createObstacle, 160);
    } else {
        createObstacle(); // Créer un obstacle normal
    }

    let nextObstacleInterval = Math.random() * (maxObstacleInterval - minObstacleInterval) + minObstacleInterval;
    obstacleInterval = setTimeout(generateObstacles, nextObstacleInterval);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = '100%'; // Positionnement initial à droite
    document.getElementById('game-container').appendChild(obstacle);
    moveObstacle(obstacle);
}

function createFlyingObstacle() {
    const flyingObstacle = document.createElement('div');
    flyingObstacle.classList.add('obstacle-flying');

    // Ajoute un ID unique à l'obstacle
    flyingObstacle.id = 'flying-obstacle-' + Date.now(); // Exemple : 'flying-obstacle-1633531530000'

    document.getElementById('game-container').appendChild(flyingObstacle);
    moveObstacle(flyingObstacle); 
}

function moveObstacle(obstacle) {
    let position = 100;
    isObstaclePassed = false; 

    const interval = setInterval(() => {
        if (position < -5) {
            clearInterval(interval);
            obstacle.remove();
        } else {
            position -= obstacleSpeed;
            obstacle.style.left = position + '%';

            const dino = document.getElementById('dino');
            const dinoRect = dino.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            const adjustedDinoRect = {
                top: dinoRect.top + 1,
                bottom: dinoRect.bottom - 10,
                left: dinoRect.left + 10,
                right: dinoRect.right - 30
            };

            const adjustedObstacleRect = {
                top: obstacleRect.top + 15,
                bottom: obstacleRect.bottom - 10,
                left: obstacleRect.left + 10,
                right: obstacleRect.right - 10
            };

            // Vérification de la collision
            if (
                adjustedDinoRect.right > adjustedObstacleRect.left &&
                adjustedDinoRect.left < adjustedObstacleRect.right &&
                adjustedDinoRect.bottom > adjustedObstacleRect.top &&
                adjustedDinoRect.top < adjustedObstacleRect.bottom
            ) {
                endGame();
                clearInterval(interval);
            }
        }
    }, 20);
}

function updateScore() {
    const minutes = Math.floor(score / 60);
    const seconds = score % 60;
    document.getElementById('current-score').innerText = `Score: ${minutes}m ${seconds}s`;

    // Mise à jour du meilleur score si nécessaire
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore); // Sauvegarde du meilleur score
    }
    document.getElementById('best-score').innerText = `Meilleur Score: ${Math.floor(bestScore / 60)}m ${bestScore % 60}s`;
}


// Initialisation des coins et du score total depuis localStorage
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0; 
let totalScore = localStorage.getItem('totalScore') ? parseInt(localStorage.getItem('totalScore')) : 0; // Score total depuis localStorage


// Fonction pour mettre à jour les pièces
function updateCoins() {
    document.getElementById('coin-display').innerText = `${coins} `; // Affiche le nombre de coins
    localStorage.setItem('coins', coins); // Sauvegarde des coins dans localStorage
}

function convertScoreToCoins() {
    coins += score; // Ajoute le score total aux coins
    totalScore += score; // Ajoute le score au total du score
    localStorage.setItem('coins', coins); // Met à jour les coins dans localStorage
    localStorage.setItem('totalScore', totalScore); // Met à jour le score total dans localStorage
    updateCoins(); // Met à jour l'affichage des coins
}


function endGame() {
    isGameOver = true;
    clearTimeout(obstacleInterval);
    clearInterval(scoreInterval); // Arrêter la mise à jour du score

    // Supprimer tous les obstacles restants
    document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
    document.querySelectorAll('.obstacle-flying').forEach(obstacle => obstacle.remove());

    // Mise à jour des scores dans l'écran "Game Over"
    document.getElementById('game-over-score').innerText = `Score: ${Math.floor(score / 60)}m ${score % 60}s`;
    document.getElementById('game-over-best-score').innerText = `Meilleur Score: ${Math.floor(bestScore / 60)}m ${bestScore % 60}s`;

    // Convertir le score en coins
    convertScoreToCoins(); // Appel de la fonction pour convertir le score en coins

    // Afficher le score total à l'écran
    document.getElementById('total-score').innerText = `Score Total: ${Math.floor(totalScore / 60)}m ${totalScore % 60}s`; // Assurez-vous que c'est mis à jour

    // Afficher l'écran "Game Over"
    document.getElementById('game-over').style.display = 'flex';
}


function restartGame() {
    score = 0; // Réinitialiser le score
    timeElapsed = 0; // Réinitialiser le temps écoulé
    isGameOver = false; // Indiquer que le jeu n'est plus terminé
    obstacleSpeed = 0.6; // Réinitialiser la vitesse des obstacles

    clearTimeout(obstacleInterval); // Arrêter l'intervalle de génération d'obstacles
    clearInterval(scoreInterval); // Arrêter la mise à jour du score

    scoreUpdated = false; // Réinitialiser l'état de mise à jour du score

    // Masquer l'écran "Game Over"
    document.getElementById('game-over').style.display = 'none';

    // Réinitialiser le score affiché en jeu
    document.getElementById('current-score').innerText = `Score: ${Math.floor(score / 60)}m ${score % 60}s`;

    // Supprimer tous les obstacles restants
    document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
    document.querySelectorAll('.obstacle-flying').forEach(obstacle => obstacle.remove()); // Supprimer aussi les oiseaux

    gameStarted = true; // Indique que le jeu a commencé
    generateObstacles(); // Démarrer la génération d'obstacles

    // Démarrer la mise à jour du score
    scoreInterval = setInterval(() => {
        timeElapsed++;
        score = timeElapsed; // Met à jour le score avec le temps écoulé
        updateScore();
    }, 1000); // Met à jour le score toutes les secondes
}

function startGame() {
    score = 0; // Réinitialiser le score
    timeElapsed = 0; // Réinitialiser le temps écoulé
    // Réinitialiser les affichages du score
    document.getElementById('current-score').innerText = `Score: ${Math.floor(score / 60)}m ${score % 60}s`;
    document.getElementById('best-score').innerText = `Meilleur Score: ${Math.floor(bestScore / 60)}m ${bestScore % 60}s`;
    document.getElementById('total-score').innerText = `Score Total: ${Math.floor(totalScore / 60)}m ${totalScore % 60}s`; // Afficher le score total
    updateCoins(); // Met à jour l'affichage des coins
    gameStarted = true; // Indique que le jeu a commencé
    generateObstacles(); // Démarrer la génération d'obstacles 


    // Démarrer la mise à jour du score
    scoreInterval = setInterval(() => {
        timeElapsed++;
        score = timeElapsed; // Met à jour le score avec le temps écoulé
        updateScore();
    }, 1000); // Met à jour le score toutes les secondes

    // Augmenter la difficulté toutes les 10 secondes
    setInterval(increaseDifficulty, 10000); // Appeler increaseDifficulty() toutes les 10 secondes
}

function increaseDifficulty() {
    obstacleSpeed += 0.05; // Augmente la vitesse des obstacles progressivement
    // Diminuer l'intervalle de génération des obstacles progressivement
    if (minObstacleInterval > 300) { // Assurez-vous que l'intervalle minimum ne devienne pas trop faible
        minObstacleInterval -= 10; // Réduire l'intervalle minimum
    }
    if (maxObstacleInterval > 700) { // Assurez-vous que l'intervalle maximum ne devienne pas trop faible
        maxObstacleInterval -= 10; // Réduire l'intervalle maximum
    }
}

// Démarrer le jeu
startGame();

const skins = [
    { id: 1, name: 'Skin Commun 1', rarity: 'common', image: 'images/skin_common_1.png' },
    { id: 2, name: 'Skin Commun 2', rarity: 'common', image: 'images/skin_common_2.png' },
    { id: 3, name: 'Skin Rare 1', rarity: 'rare', image: 'images/skin_rare_1.png' },
    { id: 4, name: 'Skin Épique 1', rarity: 'epic', image: 'images/skin_epic_1.png' }
];

let userSkins = [];


// Ajouter un skin à l'inventaire de l'utilisateur
function addSkinToInventory(skin) {
    userSkins.push(skin);
    displaySkins();
}

// Simuler la roulette aléatoire
function spinRoulette() {
    const rouletteItems = document.getElementById('roulette-items');
    const totalSkins = [...skins, ...skins, ...skins]; // Ajout pour plus de skins dans la roulette

    rouletteItems.innerHTML = ''; // Reset la roulette
    totalSkins.forEach(skin => {
        const item = document.createElement('div');
        item.classList.add('skin-item', `skin-${skin.rarity}`);
        item.style.backgroundImage = `url(${skin.image})`;
        rouletteItems.appendChild(item);
    });

    // Démarrer la roulette
    const randomStop = Math.floor(Math.random() * totalSkins.length) * -100;
    rouletteItems.style.transform = `translateX(${randomStop}px)`;

    // Sélectionner le skin après 2 secondes
    setTimeout(() => {
        const selectedSkin = totalSkins[Math.abs(randomStop / 100)];
        addSkinToInventory(selectedSkin);
    }, 2000);
}

// Afficher les skins de l'utilisateur
function displaySkins(rarity = 'all') {
    const skinGallery = document.getElementById('skin-gallery');
    skinGallery.innerHTML = '';

    const filteredSkins = rarity === 'all' ? userSkins : userSkins.filter(skin => skin.rarity === rarity);
    filteredSkins.forEach(skin => {
        const skinElement = document.createElement('div');
        skinElement.classList.add('skin-item', `skin-${skin.rarity}`);
        skinElement.style.backgroundImage = `url(${skin.image})`;
        skinGallery.appendChild(skinElement);

        // Choisir un skin pour le jeu
        skinElement.addEventListener('click', () => {
            document.getElementById('dino').style.backgroundImage = `url(${skin.image})`;
        });
    });
}

// Filtrer les skins
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const rarity = event.target.getAttribute('data-rarity');
        displaySkins(rarity);
    });
});

// Lancer la roulette lors du clic sur le bouton "Obtenir un skin"
document.getElementById('drop-button').addEventListener('click', () => {
    if (coins >= 100) { // Nécessite 100 coins pour tenter un skin
        coins -= 100;
        updateCoins();
        spinRoulette();
    } else {
        alert('Pas assez de coins!');
    }
});
