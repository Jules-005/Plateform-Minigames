// SOUNDS
var myGunshot = new Audio('http://dev.pascalou.co.uk/shooter/audio/laser_sound.m4a');
var ennemyFalling = new Audio('http://dev.pascalou.co.uk/shooter/audio/thud.m4a');
var ennemyGunshot = new Audio('http://dev.pascalou.co.uk/shooter/audio/laser_sound.m4a');
ennemyGunshot.volume = 0.4;

// SOME ESSENTIAL VARIABLES
const gameFrame = document.querySelector("#gameFrame");

var myLifePoints = 100;

function livingEnnemies() {
	return document.querySelectorAll(".ennemy:not(.dead)");
}
// Variables globales de difficulté
let difficultyLevel = 1;
let baseEnemyDamage = 20;
let baseEnemyShotDelay = 2000;
let basePlayerLifePoints = 100;
const maxLifePoints = 100;

// Mise à jour des points de vie du joueur
function updateLifePoints(amount) {
    myLifePoints = amount;
    if (myLifePoints < 1) {
        myLifePoints = 0;
        setTimeout(function() {
            if (livingEnnemies().length) {
                gameFrame.classList.add("playerDead");
            }
        }, 500);
    }
    document.getElementById("healthBar").style.width = myLifePoints + "%";
}


function increaseDifficulty() {
    difficultyLevel += 1;
    baseEnemyDamage += 5; // Augmentation des dégâts par niveau
    baseEnemyShotDelay = Math.max(500, baseEnemyShotDelay - 200); // Réduction du délai minimum (500 ms)
}

function ennemyShootsMe(ennemy) {
    if (ennemy) {
        ennemy.classList.add("showing");
        setTimeout(function() {
            if (!ennemy.classList.contains("dead")) {
                ennemyGunshot.play();
                ennemy.classList.add("shooting");
                gameFrame.classList.add("ennemyShooting");
                updateLifePoints(myLifePoints - baseEnemyDamage); // Dégâts basés sur le niveau de difficulté
                setTimeout(function() {
                    ennemy.classList.remove("shooting");
                    gameFrame.classList.remove("ennemyShooting");
                    setTimeout(function() {
                        ennemy.classList.remove("showing");
                    }, 150);
                }, 500);
            }
        }, 800);
    }
}
// Tirs aléatoires des ennemis avec un délai dynamique basé sur le niveau
function randomEnnemyShots() {
    if (myLifePoints > 0) {
        if (livingEnnemies().length) {
            var randomEnnemy = Math.floor(Math.random() * livingEnnemies().length);
            var randomDelay = Math.floor(Math.random() * baseEnemyShotDelay) + 500; // Délai basé sur la difficulté
            setTimeout(function() {
                if (myLifePoints > 0) {
                    ennemyShootsMe(livingEnnemies()[randomEnnemy]);
                    randomEnnemyShots();					
                }
            }, randomDelay);
        }
    }
}

// DAMAGE AND DEATH
function updateLifePoints(amount) {
	myLifePoints = amount;
	if(myLifePoints < 1) {
		myLifePoints = 0;
		setTimeout(function() {
			if(livingEnnemies().length) {
				gameFrame.classList.add("playerDead");
			}
		}, 500);
	}
	document.getElementById("healthBar").style.width = myLifePoints+"%";
}

function iShoot(ennemy) {
    ennemy.classList.remove("shooting");
    ennemy.classList.add("dead");
    ennemyFalling.play();

    if (!livingEnnemies().length) {
        setTimeout(function() {
            gameFrame.classList.add("playerWon");
            increaseDifficulty(); // Augmente la difficulté pour la prochaine partie
            
            // Regagner 20 points de vie, sans dépasser le maximum
            myLifePoints = Math.min(myLifePoints + 20, maxLifePoints);
            document.getElementById("healthBar").style.width = myLifePoints + "%";
        }, 300);
    }
}

// VISUAL AND SOUND EFFECTS WHEN I SHOOT
function myShootingEffects() {
	myGunshot.play();
	gameFrame.classList.add("playerShooting");
	setTimeout(function() {
		gameFrame.classList.remove("playerShooting");
	}, 150);
}


function newGame() {
    document.querySelectorAll(".ennemy").forEach(ennemy => {
        ennemy.classList = ["ennemy"];
    });

    gameFrame.classList = [];

    setTimeout(function() {
        randomEnnemyShots();
    }, 3000);
}


livingEnnemies().forEach(ennemy => {

	ennemy.addEventListener("click", function() {
		iShoot(ennemy);
	});

});