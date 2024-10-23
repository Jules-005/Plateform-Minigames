window.onload = function(){
  var c = document.querySelector("canvas");
  var canvas = document.querySelector("canvas");
  c.width = innerWidth;
  c.height = innerHeight;
  c = c.getContext("2d");

  function startGame(){
      mouse = {
          x: innerWidth / 2,
          y: innerHeight - 33
      };

      touch = {
          x: innerWidth / 2,
          y: innerHeight - 33
      };

      canvas.addEventListener("mousemove", function(event){
          mouse.x = event.clientX;
      });
      canvas.addEventListener("touchmove", function(event){
          var rect = canvas.getBoundingClientRect();
          var root = document.documentElement;
          var touch = event.changedTouches[0];
          var touchX = parseInt(touch.clientX);
          var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
          event.preventDefault();
          mouse.x = touchX;
          mouse.y = touchY;
      });

      var player_width = 32;
      var player_height = 32;
      var playerImg = new Image();
      var score = 0;
      var health = 100;
      var activeCannons = 1; // Nombre de canons actifs, limité à 3
      var multiShotActive = false; // Active pour tirs supplémentaires avec diagonales
      var multiShotTimer = 0; // Timer pour le multi-tir
      var maxCannons = 3; // Limite du nombre de canons supplémentaires

      playerImg.src = "https://image.ibb.co/dfbD1U/heroShip.png";

      var _bullets = [];
      var bullet_width = 6;
      var bullet_height = 8;
      var bullet_speed = 10;

      var _enemies = [];
      var enemyImg = new Image();
      enemyImg.src = "https://i.ibb.co/0YgHvmx/enemy-fotor-20230927153748.png";
      var enemy_width = 32;
      var enemy_height = 32;

      var _healthkits = [];
      var healthkitImg = new Image();
      healthkitImg.src = "https://image.ibb.co/gFvSEU/first_aid_kit.png";
      var healthkit_width = 32;
      var healthkit_height = 32;

      var _multiShotItems = []; // Item pour activer le multi-tir
      var multiShotImg = new Image();
      multiShotImg.src = "https://image.ibb.co/gFvSEU/multi_shot.png"; // Placeholder pour l'image
      var multiShot_width = 32;
      var multiShot_height = 32;

      function Player(x, y, width, height){
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;

          this.draw = function(){
              c.beginPath();
              c.drawImage(playerImg, mouse.x - player_width, mouse.y - player_height);
          };

          this.update = function(){
              this.draw();
          };
      }

      function Bullet(x, y, width, height, speed, directionX = 0){
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.speed = speed;
          this.directionX = directionX; // Ajout d'un décalage horizontal pour les tirs diagonaux

          this.draw = function(){
              c.beginPath();
              c.rect(this.x, this.y, this.width, this.height);
              c.fillStyle = "white";
              c.fill();
          };

          this.update = function(){
              this.y -= this.speed;
              this.x += this.directionX; // Appliquer le décalage horizontal
              this.draw();
          };
      }

      function Enemy(x, y, width, height, speed){
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.speed = speed;

          this.draw = function(){
              c.beginPath();
              c.drawImage(enemyImg, this.x, this.y);
          };

          this.update = function(){
              this.y += this.speed;
              this.draw();
          };
      }

      function Healthkit(x, y, width, height, speed){
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.speed = speed;

          this.draw = function(){
              c.beginPath();
              c.drawImage(healthkitImg, this.x, this.y);
          };

          this.update = function(){
              this.y += this.speed;
              this.draw();
          };
      }

      function MultiShotItem(x, y, width, height, speed){
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.speed = speed;

          this.draw = function(){
              c.beginPath();
              c.drawImage(multiShotImg, this.x, this.y);
          };

          this.update = function(){
              this.y += this.speed;
              this.draw();
          };
      }

      var __player = new Player(mouse.x, mouse.y, player_width, player_height);

      function drawEnemies(){
          for (var _ = 0; _ < 4; _++){
              var x = Math.random() * (innerWidth - enemy_width);
              var y = -enemy_height;
              var width = enemy_width;
              var height = enemy_height;
              var speed = Math.random() * 2;
              var __enemy = new Enemy(x, y, width, height, speed);
              _enemies.push(__enemy);
          }
      } setInterval(drawEnemies, 1234);

      function drawHealthkits(){
          for (var _ = 0; _ < 1; _++){
              var x = Math.random() * (innerWidth - enemy_width);
              var y = -enemy_height;
              var width = healthkit_width;
              var height = healthkit_height;
              var speed = Math.random() * 2.6;
              var __healthkit = new Healthkit(x, y, width, height, speed);
              _healthkits.push(__healthkit);
          }
      } setInterval(drawHealthkits, 15000);
// Fonction pour dessiner un rectangle avec des bords arrondis
function drawRoundedRect(x, y, width, height, radius, fillColor) {
  c.beginPath();
  c.moveTo(x + radius, y);
  c.arcTo(x + width, y, x + width, y + height, radius);
  c.arcTo(x + width, y + height, x, y + height, radius);
  c.arcTo(x, y + height, x, y, radius);
  c.arcTo(x, y, x + width, y, radius);
  c.fillStyle = fillColor;
  c.fill();
}

function drawMultiShotItems() {
  for (var _ = 0; _ < 1; _++) {
      var x = Math.random() * (innerWidth - healthkit_width);
      var y = -healthkit_height;
      var width = healthkit_width;
      var height = healthkit_height;
      var speed = Math.random() * 2.6;

      // Créer un nouvel objet Multi-shot
      var __multiShotItem = new MultiShotItem(x, y, width, height, speed);
      _multiShotItems.push(__multiShotItem);
  }
}

    function MultiShotItem(x, y, width, height, speed) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
  
      this.draw = function() {
          // Dessine le rectangle bleu avec des bords arrondis
          drawRoundedRect(this.x, this.y, this.width, this.height, 10, "blue"); // 10 est le rayon des coins arrondis
  
          // Affiche un gros * qui prend tout l'espace du rectangle
          c.fillStyle = "white"; // Couleur du texte
          c.font = "bold " + (this.height * 0.9) + "px Arial"; // Taille du texte presque aussi grande que le rectangle
          c.textAlign = "center"; // Centre horizontalement
          c.textBaseline = "middle"; // Centre verticalement
          c.fillText("×", this.x + this.width / 2, this.y + this.height / 2); // Centre le * dans le rectangle
      };
  
      this.update = function() {
          this.y += this.speed;
          this.draw();
      };
  }

      function fire(){
          for (var _ = 0; _ < activeCannons; _++){
              var x = mouse.x - bullet_width / 2 + _ * (bullet_width + 5); // Ajoute un décalage horizontal pour chaque canon
              var y = mouse.y - player_height;
              var __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
              _bullets.push(__bullet);
          }
          if (multiShotActive && multiShotTimer > 0) { // Si multi-shot est actif
              var directions = [0, -2, 2]; // Un tir droit, un en diagonale gauche et un en diagonale droite
              for (var _ = 0; _ < directions.length; _++) {
                  var x = mouse.x - bullet_width / 2;
                  var y = mouse.y - player_height;
                  var __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed, directions[_]);
                  _bullets.push(__bullet);
              }
              function randomMultiShotItemInterval() {
                var randomDelay = Math.random() * (40000 - 20000) + 20000; // Délai aléatoire entre 20000ms (20s) et 40000ms (40s)
                setTimeout(function() {
                    drawMultiShotItems();
                    randomMultiShotItemInterval(); // Relance la fonction après chaque apparition
                }, randomDelay);
            }
            
            randomMultiShotItemInterval(); // Appelle la fonction pour la première fois
            
          }
      } setInterval(fire, 200);

      function collision(a, b){
          return a.x < b.x + b.width &&
                 a.x + a.width > b.x &&
                 a.y < b.y + b.height &&
                 a.y + a.height > b.y;
      }

      c.font = "1em Arial";

      function animate(){
          requestAnimationFrame(animate);
          c.beginPath();
          c.clearRect(0, 0, innerWidth, innerHeight);
          c.fillStyle = 'white';
          c.fillText("Health: " + health, 100, 20);
          c.fillText("Score: " + score, innerWidth - 100, 20);

          __player.update();

          for (var i = 0; i < _bullets.length; i++){
              _bullets[i].update();
              if (_bullets[i].y < 0 || _bullets[i].x < 0 || _bullets[i].x > innerWidth){
                  _bullets.splice(i, 1);
              }
          }

          for (var k = 0; k < _enemies.length; k++){
              _enemies[k].update();
              if (_enemies[k].y > innerHeight){
                  _enemies.splice(k, 1);
                  health -= 10;
                  if (health == 0){
                      alert("You DIED!\nYour score was " + score);
                      startGame();
                  }
              }
          }

          for (var j = _enemies.length - 1; j >= 0; j--){
              for (var l = _bullets.length - 1; l >= 0; l--){
                  if (collision(_enemies[j], _bullets[l])){
                      _enemies.splice(j, 1);
                      _bullets.splice(l, 1);
                      score++;
                      if (score % 50 === 0 && activeCannons < maxCannons) activeCannons++; // Limite le nombre de canons à 3
                  }
              }
          }

          for (var h = 0; h < _healthkits.length; h++){
              _healthkits[h].update();
          }

          for (var hh = _healthkits.length - 1; hh >= 0; hh--){
              for (var hhh = _bullets.length - 1; hhh >= 0; hhh--){
                  if (collision(_healthkits[hh], _bullets[hhh])){
                      _healthkits.splice(hh, 1);
                      _bullets.splice(hhh, 1);
                      health += 10;
                  }
              }
          }

          // Gestion du multi-shot item
          for (var h = 0; h < _multiShotItems.length; h++){
              _multiShotItems[h].update();
          }

          for (var hh = _multiShotItems.length - 1; hh >= 0; hh--){
              for (var hhh = _bullets.length - 1; hhh >= 0; hhh--){
                  if (collision(_multiShotItems[hh], _bullets[hhh])){
                      _multiShotItems.splice(hh, 1);
                      _bullets.splice(hhh, 1);
                      multiShotActive = true;
                      multiShotTimer = 70; 
                  }
              }
          }

      }

      animate();
  }
  startGame();
};
