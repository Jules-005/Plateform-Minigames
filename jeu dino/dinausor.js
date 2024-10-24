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

let currentDinoSkin = null;
let currentObstacleSkin = null;
let currentFlyingObstacleSkin = null;
let currentDecorSkin = null;
let currentCactusDecorSkin = null;


document.addEventListener('keydown', function(event) {
    const dino = document.getElementById('dino');

    // Empêche le comportement par défaut des touches
    if (event.code === 'Space' || event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        event.preventDefault();
    }

    if ((event.code === 'Space' || event.code === 'ArrowUp') && !isGameOver) {
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
            // Récupérer le skin appliqué à l'obstacle pour utiliser ses ajustements
    let collisionAdjustments = { top: 0, bottom: 0, left: 0, right: 0 };  // Par défaut, pas d'ajustement
    if (obstacle.classList.contains('eiffel')) {
        collisionAdjustments = skins.find(skin => skin.name === 'Tour Eiffel').collisionAdjustments;
    } else if (obstacle.classList.contains('empire')) {
        collisionAdjustments = skins.find(skin => skin.name === 'Empire State Building').collisionAdjustments;
    } else if (obstacle.classList.contains('liberty')) {
        collisionAdjustments = skins.find(skin => skin.name === 'Statut de la liberté').collisionAdjustments;
    }

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

    if (currentObstacleSkin) {
        obstacle.style.backgroundImage = `url(${currentObstacleSkin.image})`;

        // Ajouter une classe spécifique selon le skin
        if (currentObstacleSkin.name === 'Tour Eiffel') {
            obstacle.classList.add('eiffel');
        } else if (currentObstacleSkin.name === 'Empire State Building') {
            obstacle.classList.add('empire');
        } else if (currentObstacleSkin.name === 'Statut de la liberté') {
            obstacle.classList.add('liberty');
        }
    }

    document.getElementById('game-container').appendChild(obstacle);
    moveObstacle(obstacle);
}

function createFlyingObstacle() {
    const flyingObstacle = document.createElement('div');
    flyingObstacle.classList.add('obstacle-flying');
    flyingObstacle.id = 'flying-obstacle-' + Date.now(); // ID unique

    // Applique le skin sélectionné, s'il y en a un
    if (currentFlyingObstacleSkin) {
        flyingObstacle.style.backgroundImage = `url(${currentFlyingObstacleSkin.image})`;
        console.log("Skin appliqué à l'obstacle volant : ", currentFlyingObstacleSkin.name);
    } 

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
const defaultSkins = [
    { id: 1, name: 'Oiseau', rarity: 'common', image: 'images/oiseau-removebg-preview.png', category: 'obstacle2', price: 0 },
    { id: 2, name: 'Cactus', rarity: 'common', image: 'images/cactusdebase.png', category: 'obstacle', price: 0 },
    { id: 3, name: 'Soleil', rarity: 'common', image: 'images/gifsoleil.gif', category: 'decor', price: 0 },
    { id: 4, name: 'Cactus Animé', rarity: 'rare', image: 'images/gifcactus.gif', category: 'decor2', price: 0 },
    { id: 5, name: 'Dinosaure de base', rarity: 'common', image: 'images/image0-removebg-preview.png', category: 'dino', price: 0 }
];

const step2Skins = [
    { id: 6, name: 'Batman', rarity: 'rare', image: 'images/batman-removebg-preview.png', category: 'dino', price: 3 },
    { id: 7, name: 'Statut de la liberté', rarity: 'epic', image: 'images/liberte-removebg-preview.png', category: 'obstacle', price: 3 },
    { id: 8, name: 'Père Noël', rarity: 'rare', image: 'images/perernoel-removebg-preview.png', category: 'dino', price: 3 },
    { id: 9, name: 'Godzilla', rarity: 'common', image: 'images/godzilla-removebg-preview.png', category: 'dino', price: 3 },
    { id: 10, name: 'Naruto', rarity: 'rare', image: 'images/narutoi-removebg-preview.png', category: 'dino', price: 3 },
    { id: 11, name: 'Dragon', rarity: 'epic', image: 'images/dragonobstacle-ezgif.com-rotate.gif', category: 'obstacle2', price: 3 },
    { id: 10, name: 'Coureur', rarity: 'rare', image: 'images/personnecourir-ezgif.com-rotate.gif', category: 'dino', price: 3 },
    { id: 13, name: 'Cat', rarity: 'rare', image: 'images/cat1.webp', category: 'dino', price: 3 },
    { id: 14, name: 'Coq', rarity: 'rare', image: 'images/coq-removebg-preview.png', category: 'dino', price: 3 },
    { id: 15, name: 'Drone', rarity: 'rare', image: 'images/drone-removebg-preview.png', category: 'obstacle2', price: 3 },
    { id: 16, name: 'Avion de ligne', rarity: 'rare', image: 'images/avion2-removebg-preview.png', category: 'obstacle2', price: 3 },
    { id: 17, name: 'Avion en papier', rarity: 'common', image: 'images/avion1-removebg-preview.png', category: 'obstacle2', price: 3 },
    { id: 18, name: 'Tour Eiffel', rarity: 'rare', image: 'images/eiffel.webp', category: 'obstacle', price: 3 },
    { id: 19, name: 'Empire State Building ', rarity: 'rare', image: 'images/tour_new_york-removebg-preview.png', category: 'obstacle', price: 3 },
    { id: 20, name: 'Quart de lune', rarity: 'rare', image: 'images/tierlune.gif', category: 'decor', price: 3 },
    { id: 28, name: 'Aigle', rarity: 'commun', image: 'images/aigle-removebg-preview.png', category: 'obstacle2', price: 3 },
    { id: 21, name: 'Lune', rarity: 'epic', image: 'images/lunegif.gif', category: 'decor', price: 3 },
    { id: 22, name: 'Pleine lune', rarity: 'common', image: 'images/lune-removebg-preview.png', category: 'decor', price: 3 },
    { id: 23, name: 'Emoji', rarity: 'rare', image: 'images/emoji.gif', category: 'decor', price: 3 },
    { id: 24, name: 'Dauphin', rarity: 'epic', image: 'images/dauphindino.gif', category: 'dino', price: 3 },
    { id: 25, name: 'Banane', rarity: 'epic', image: 'images/bananedino-ezgif.com-rotate.gif', category: 'dino', price: 3 },
    { id: 26, name: 'Animation chat', rarity: 'common', image: 'images/chatgif.gif', category: 'decor2', price: 3 },
    { id: 27, name: 'Dragon', rarity: 'epic', image: 'images/dragonobstacle-ezgif.com-rotate.gif', category: 'obstacle2', price: 3 },
    { id: 28, name: 'Raie', rarity: 'epic', image: 'images/obstacleraie.gif', category: 'obstacle2', price: 3 },
];

let userSkins = JSON.parse(localStorage.getItem('userSkins')) || []; // Récupérer les skins depuis localStorage
let step2Unlocked = JSON.parse(localStorage.getItem('step2Unlocked')) || false; // Vérifier si l'étape 2 est déverrouillée

// Vérifier si l'inventaire est vide et y ajouter les skins par défaut
if (userSkins.length === 0) {
    userSkins = defaultSkins;
    localStorage.setItem('userSkins', JSON.stringify(userSkins)); // Sauvegarder dans localStorage
}

// Vérifier si l'étape 2 est déjà déverrouillée et masquer le bouton si c'est le cas
if (step2Unlocked) {
    document.getElementById('unlock-button').style.display = 'none'; // Masquer le bouton si déjà déverrouillé
}

// Afficher le nombre de coins
function updateCoins() {
    document.getElementById('coin-display').textContent = coins;
}

function unlockStep2() {
    if (coins >= 5) { // Exiger 5 pièces pour débloquer
        coins -= 5;
        step2Unlocked = true;
        updateCoins();
        displaySkins(); // Mettre à jour l'affichage après déblocage
        document.getElementById('unlock-button').style.display = 'none'; // Cacher le bouton
    } else {
        alert('Pas assez de pièces pour débloquer l\'étape 2 !');
    }
    localStorage.setItem('step2Unlocked', true); // Sauvegarder l'état du déblocage de l'étape 2
}

function displaySkins() {
    const skinGallery = document.getElementById('skin-gallery');
    skinGallery.innerHTML = ''; // Réinitialiser la galerie

    const skinsToDisplay = [...defaultSkins, ...(step2Unlocked ? step2Skins : [])];

    skinsToDisplay.forEach(skin => {
        const skinElement = document.createElement('div');
        skinElement.classList.add('skin-item', userSkins.some(ownedSkin => ownedSkin.id === skin.id) ? 'owned' : 'not-owned');
        skinElement.style.backgroundImage = `url(${skin.image})`;
        skinElement.style.backgroundSize = 'cover'; // Pour couvrir l'élément

        const skinPrice = document.createElement('div');
        skinPrice.classList.add('skin-price');
        skinPrice.textContent = skin.price > 0 ? `${skin.price} pièces` : 'Gratuit';

        skinElement.appendChild(skinPrice);

        // Événement de clic pour acheter et appliquer le skin
        skinElement.addEventListener('click', () => {
            const skinAlreadyOwned = userSkins.some(ownedSkin => ownedSkin.id === skin.id);
            if (!skinAlreadyOwned) {
                // Acheter le skin seulement s'il n'est pas possédé
                if (coins >= skin.price) {
                    userSkins.push({...skin}); // Ajouter le skin à l'inventaire (copie du skin)
                    coins -= skin.price; // Déduire le coût
                    localStorage.setItem('userSkins', JSON.stringify(userSkins)); // Sauvegarder dans localStorage
                    updateCoins();
                    applySkin(skin); // Appliquer le skin immédiatement après l'achat
            
                    // Mettre à jour l'affichage des skins (sans duplication)
                    displaySkins();
                } else {
                    alert('Pas assez de pièces pour acheter ce skin !');
                }
            } else {
                applySkin(skin); // Appliquer le skin si déjà possédé
            }
            switch(skin.category) {
                case 'dino':
                    currentDinoSkin = skin;
                    document.getElementById('dino').style.backgroundImage = `url(${skin.image})`; // Appliquer le skin directement au dino
                    break;
                    case 'obstacle':
    // Mettre à jour le skin actuel des futurs obstacles
    currentObstacleSkin = skin;
    
    // Modifier les obstacles déjà présents à l'écran
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        // Appliquer l'image du skin sélectionné
        obstacle.style.backgroundImage = `url(${skin.image})`;

        // Enlever toutes les classes spécifiques précédentes
        obstacle.classList.remove('eiffel', 'empire', 'liberty');

        // Ajouter une classe spécifique en fonction du skin
        if (skin.name === 'Tour Eiffel') {
            obstacle.classList.add('eiffel');
        } else if (skin.name === 'Empire State Building') {
            obstacle.classList.add('empire');
        } else if (skin.name === 'Statut de la liberté') {
            obstacle.classList.add('liberty');
        }
    });
    break;

                case 'obstacle2':
                    currentFlyingObstacleSkin = skin;
                    break;
                case 'decor':
                    currentDecorSkin = skin;
                    break;
                case 'decor2':
                    currentCactusDecorSkin = skin;
                    break;
                default:
                    console.log('Catégorie inconnue:', skin.category);
            }
        });

        skinGallery.appendChild(skinElement);
    });
}

// Gestion du bouton de déblocage
const unlockButton = document.getElementById('unlock-button');
unlockButton.addEventListener('click', unlockStep2);

function applySkin(skin) {
    if (!skin.category) {
        console.error("Skin sans catégorie détecté : ", skin.name);
        return;
    }
    switch (skin.category) {
        case 'dino':
            document.getElementById('dino').style.backgroundImage = `url(${skin.image})`;
            break;
        case 'obstacle':
            // Applique le skin aux obstacles normaux
            document.querySelectorAll('.obstacle').forEach(obstacle => {
                obstacle.style.backgroundImage = `url(${skin.image})`;
            });
            break;
        case 'obstacle2':
            // Applique le skin aux obstacles volants
            document.querySelectorAll('.obstacle-flying').forEach(obstacle => {
                obstacle.style.backgroundImage = `url(${skin.image})`;
            });
            break;
        case 'decor':
            document.querySelector('.sun-decoration').style.backgroundImage = `url(${skin.image})`;
            break;
        case 'decor2':
            document.querySelector('.cactus-decoration').style.backgroundImage = `url(${skin.image})`;
            break;
        default:
            console.error("Catégorie inconnue ou non spécifiée pour le skin: ", skin.name);
    }
}

const skins = [
    {
        name: 'Tour Eiffel',
        image: 'eiffel.jpg',
        collisionAdjustments: { top: 15, bottom: -10, left: 10, right: -10 }  // Ajustements spécifiques pour les collisions
    },
    {
        name: 'Empire State Building',
        image: 'empire.jpg',
        collisionAdjustments: { top: 20, bottom: -15, left: 15, right: -20 }
    },
    {
        name: 'Statut de la liberté',
        image: 'liberty.jpg',
        collisionAdjustments: { top: -7000, bottom: -70, left: -150, right: -150 }
    }
];
let colorMenuUnlocked = localStorage.getItem('colorMenuUnlocked') === 'true'; // Récupérer l'état du déblocage de menu de couleur

// Vérifie si une couleur a été sauvegardée et l'applique (si applicable)
// const savedColor = localStorage.getItem('gameBackgroundColor');
// if (savedColor) {
//     document.getElementById('game-container').style.backgroundColor = savedColor;
// }

// Fonction pour mettre à jour l'affichage des pièces
function updateCoins() {
    document.getElementById('coin-display').innerText = coins;
    localStorage.setItem('coins', coins); // Sauvegarder la nouvelle valeur des coins dans localStorage
}

// Fonction pour déverrouiller le menu de couleurs
function unlockColorMenu() {
    if (coins >= 5) { // Vérifie si le joueur a au moins 5 pièces
        coins -= 5; // Retire 5 pièces
        localStorage.setItem('coins', coins); // Sauvegarder la nouvelle valeur des coins dans localStorage
        updateCoins(); // Mettre à jour l'affichage des coins

        // Affiche le menu de couleurs
        document.getElementById('color-picker').style.display = 'block';

        // Cache le bouton de déblocage
        document.getElementById('unlock-color-button').style.display = 'none'; 

        // Sauvegarde l'état de déblocage du menu couleur
        localStorage.setItem('colorMenuUnlocked', true); 
    } else {
        alert('Pas assez de pièces pour débloquer le menu couleur !');
    }
}

// Ajoute l'écouteur d'événements pour le bouton de déblocage du menu couleur
document.getElementById('unlock-color-button').addEventListener('click', unlockColorMenu);

// Écouteur d'événements pour appliquer la couleur
document.getElementById('apply-color').addEventListener('click', function() {
    const selectedColor = document.getElementById('color-input').value;
    document.getElementById('game-container').style.backgroundColor = selectedColor; // Appliquer la couleur au conteneur du jeu

    // Sauvegarder la couleur dans le local storage
    // localStorage.setItem('gameBackgroundColor', selectedColor); // Si tu veux garder ça
});

// Vérifie si le menu de couleur est déverrouillé au chargement de la page
if (colorMenuUnlocked) {
    document.getElementById('color-picker').style.display = 'block'; // Affiche le menu de couleur
    document.getElementById('unlock-color-button').style.display = 'none'; // Cache le bouton de déblocage
} else {
    document.getElementById('color-picker').style.display = 'none'; // Cache le menu de couleur par défaut
}
localStorage.setItem('coins', coins); // Sauvegarder la nouvelle valeur des coins dans localStorage
updateCoins(); // Mettre à jour l'affichage des coins
displaySkins();
