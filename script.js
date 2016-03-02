// requestAnimFrame stop animation when you go to other tab in browser
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
		  window.oRequestAnimationFrame    ||
		  window.msRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function(){
	var game = {};
	game.ctxBackground = document.getElementById("backgroundCanvas").getContext("2d");
	game.ctxPlayer = document.getElementById("playerCanvas").getContext("2d");
	game.ctxEnemy = document.getElementById("enemyCanvas").getContext("2d");
		
	game.stars = [];
	game.images = [];
	game.doneImages = 0;
	game.requiredImages = 0;
	game.keys = [];
	game.speed = 5;
	game.width = 500;
	game.height = 500;
	game.enemies =  [];
	game.count = 0;
	game.division = 200;
	game.left = true;
	game.enemySpeed = 1;
	game.bullets = [];
	game.bulletSpeed = 3;
	game.shootTimerConst = 20;
	game.shootTimer = game.shootTimerConst;
	game.gameOver = false;
	game.gameWin = false;
	
	game.player = {
		x: game.width/2.5,
		y: game.height - 80,
		width: 90,
		height: 63,
		rendered: true
	};
	
	$(document).keydown(function(e){
		game.keys[e.keyCode] = true;
		
	});
	
	$(document).keyup(function(e){
		delete game.keys[e.keyCode];
	});
	
	function init(){
		for(i = 0; i < 500; i++){
			game.stars.push({
				x: Math.random()*game.width,
				y: Math.random()*game.height,
				size: Math.random() * 3
				
			});
		}
		
		for(j=0; j< 3; j++){
			for(k=0; k<5; k++){
				game.enemies.push({
					x: k * 60 ,
					y: j * 70,
					width: 60,
					height: 60,
					image: 1,
					dead: false,
					deadTime: 20
				});
			}
		}
		
		loop();
	}
	
	function addBullets(){
		game.bullets.push({
			x: game.player.x + 41,
			y: game.player.y,
			width: 5,
			height: 10
		});
	}
	
	function addStars(num){
		for(i = 0; i < num; i++){
			game.stars.push({
				x: Math.random()*game.width,
				y: game.height + 10,
				size: Math.random() * 3
				
			});
		}
	}
	
	function update(){
		game.count++;
		if(game.shootTimer > 0){
			game.shootTimer--;
		}
		addStars(1);
		for(i in game.stars){
			if(game.stars[i].y < -5){
				game.stars.splice(i, 1);
			}else{
				game.stars[i].y--;
			}
		}
		if(game.keys[37]){
			if(game.player.x > -10){
				game.player.x-=game.speed;
				game.player.rendered = true;
			}
		}
		
		if(game.keys[39]){
			if(game.player.x < game.width - game.player.width + 10){
				game.player.x+=game.speed;
				game.player.rendered = true;
			}
		}
		
		if(game.keys[32] && game.shootTimer == 0){
			addBullets();
			game.shootTimer = game.shootTimerConst;
		}
		
		if(game.count % game.division == 0){
			game.left = !game.left;
		}
		
		for(i in game.enemies){
			if(game.left){
				game.enemies[i].x += game.enemySpeed;
			}else{
				game.enemies[i].x -= game.enemySpeed;
			}
		}
		
		for(i in game.bullets){
			if(game.bullets[i].y < - 10){
				game.bullets.splice(i, 1);
			}else{
				game.bullets[i].y-= game.bulletSpeed;
			}
		}
		
		for(m in game.enemies){
			for(b in game.bullets){
				if(collision(game.bullets[b], game.enemies[m])){
					game.enemies[m].dead = true;
					game.enemies[m].image = 3;
					game.ctxEnemy.clearRect(game.bullets[b].x, game.bullets[b].y, game.bullets[b].width, game.bullets[b].height);
					game.bullets.splice(b, 1);
				}
			}
		}
		
		for(i in game.enemies){
			if(game.enemies[i].dead){
				game.enemies[i].deadTime--;
			}
			if(game.enemies[i].dead && game.enemies[i].deadTime == 0){
				game.ctxEnemy.clearRect(game.enemies[i].x, game.enemies[i].y, game.enemies[i].width, game.enemies[i].height);
				game.enemies.splice(i, 1);
			}
		}
	}
	
	function render(){
		game.ctxBackground.clearRect(0, 0, game.width, game.height);
		game.ctxBackground.fillStyle = "#fff";
	
		for(i in game.stars){
			game.ctxBackground.fillRect(game.stars[i].x, game.stars[i].y, game.stars[i].size, game.stars[i].size);
		}
		
		if(game.player.rendered){
			game.ctxPlayer.clearRect(0, 400, game.width, game.height);//ne e nujno celia da se chisti ako se polzva samo chast ot canvasa
			game.ctxPlayer.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
			game.player.rendered = false;
		}
		
		game.ctxEnemy.clearRect(0, 0, game.width, game.height);
		for(i in game.enemies){
			game.ctxEnemy.drawImage(game.images[game.enemies[i].image], game.enemies[i].x, game.enemies[i].y, game.enemies[i].width, game.enemies[i].height);
			
		}
		
		for(i in game.bullets){
			game.ctxEnemy.drawImage(game.images[2], game.bullets[i].x, game.bullets[i].y, game.bullets[i].width, game.bullets[i].height);
		}
	}
	
	function loop(){
		requestAnimFrame(function(){
			loop();
		});
		update();
		render();
	}
	
	function initImages(paths){
		game.requiredImages = paths.length;
		for(i in paths){
			var image = new Image();
			image.src = paths[i];
			game.images[i] = image;
			game.images[i].onload = function(){
				game.doneImages++;
			}
		}
	}
	
	function checkImages(){
		if(game.doneImages == game.requiredImages){
			init();
		}else{
			setTimeout(function(){
				checkImages();
			}, 1);
		}
	
	}
	
	function collision(first, second){
		return !(first.x > second.x + second.width ||
			first.x + first.width < second.x ||
			first.y > second.y + second.height ||
			first.y + first.height < second.y);
	}
	
	game.ctxBackground.fillStyle = "#fff";
	game.ctxBackground.font = "bold 30px arial";
	game.ctxBackground.fillText("loading...", 170, 230);
	initImages(["player.png", "enemy.png", "bullet.png", "explosion.png"]);
	checkImages();
	
})();

