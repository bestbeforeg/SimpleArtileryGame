function game() {
	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		gravity = 9.81,
		turn = 1,
		isGameOver = false,
		shootTimer,
		shell,
		Img = {
			player1 : new Image(),
			player2 : new Image(),
			shell : new Image(),
			map : new Image(),
		};
	Img.player1.src = './img/tank.png';
	Img.player2.src = './img/tank2.png';
	Img.shell.src = './img/shell.png';
	Img.map.src = './img/map.png';

	ctx.mozImageSmoothingEnabled = false; //better graphics for pixel art
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;


		
	let	player1 = {
			name : 'Player 1',
			x: 0,
			y: 0,	
			angle : 180,
			stepAngle : 22.5,
			power : 80,
			aimPosition : 0,
			img : Img.player1,
		},
		player2 = {
			name : 'Player 2',
			x: 0,
			y: 0,
			angle : 180,
			stepAngle : 22.5,
			power : 80,
			aimPosition : 0,
			img : Img.player2,
		};	

	let	curPlayer;
	let round = function () {
		if(turn % 2 == 0)
			curPlayer = player2;
		else
			curPlayer = player1;
		
		shell = {
			posX : [6,8,19,28,32,39,45,55,61],
			posY : [18,6,1,-1,1,-1,1,5,16],
			x : 0,
			y : 0,
			framePosition : 0,
			t : 0,
		};
	}

	Img.map.onload = function () {
		ctx.drawImage(Img.map, 0, 0);
		position(player1);
		draw(player1);
		position(player2);
		draw(player2);
	}	

	let draw = function (player){
		ctx.drawImage(player.img, player.aimPosition * (player1.img.width / 9), 0, player1.img.width / 9, player1.img.height, player.x, player.y, player1.img.width / 9, player1.img.height);
	}

	let position = function(player){
		let randomPos = Math.round(Math.random() * (mapPositions.length -1));
		player.x = mapPositions[randomPos][1] * 32;
		player.y = mapPositions[randomPos][0] * 32 - (player.img.height - 17);
		player.width = player.img.width / 9;
		player.height = player.img.height - 17;
		for(let i = 0; i < mapPositions.length; i++){
			if(mapPositions[i][0] == mapPositions[randomPos][0])
				mapPositions.splice(i, 5);
		}
		if(player.x < canvas.width / 2){
			player.aimPosition = 8;
			player.angle = 0;
		}
		else{
			player.aimPosition = 0;
			player.angle = 180;
		}
	};


	let isShooting = false;
	let shoot = function(player){
		//calculate trajectory
		let vx = player.power * Math.cos(player.angle/180*Math.PI),
			vy = player.power * Math.sin(player.angle/180*Math.PI);
		shell.t +=0.08;
		shell.x = shell.posX[player.aimPosition] + player.x + vx*shell.t;
		shell.y = shell.posY[player.aimPosition] + player.y - (vy*shell.t - (gravity/2)*shell.t*shell.t);
		shell.width = Img.shell.width / 19;
		shell.height = Img.shell.height;
		
		//draw shell
		ctx.save();
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(Img.map, 0, 0);
		draw(player1);
		draw(player2);
		ctx.drawImage(Img.shell, shell.framePosition * Img.shell.width / 19, 0, Img.shell.width / 19, Img.shell.height, shell.x, shell.y, Img.shell.width / 19, Img.shell.height);
		ctx.restore();

		isShooting = true;
		
		if(Math.ceil(shell.t) % 2 == 0)
			shell.framePosition ++;

		if (shell.y > canvas.height || shell.y + Img.shell.height < 0 || shell.x > canvas.width || shell.x + Img.shell.width / 9 < 0){
			isShooting = false;
			clearInterval(shootTimer);
			turn++;
			round();
		}

		if(shell.framePosition > 18)
			shell.framePosition = 18;	

		let isHit;
		if(turn % 2 == 0){
			isHit = testCollisionRect(shell, player1);
		}
		else{
			isHit = testCollisionRect(shell, player2);
		}

		if(isHit){
			clearInterval(shootTimer);
			ctx.save();
			ctx.clearRect(0, 0, 800, 600);
			ctx.drawImage(Img.map, 0, 0);
			draw(player1);
			draw(player2);
			ctx.restore();
			isGameOver = true;
			gameOver(curPlayer);
		}
	}

	

	let aim = function(event, player){
		if (event.keyCode == 68) {
			player.aimPosition ++;
			player.angle = Math.abs(player.aimPosition * player.stepAngle - 180);
		}
		else if(event.keyCode == 65){
			player.aimPosition --;
			player.angle = Math.abs(player.aimPosition * player.stepAngle  - 180);
		}

		if(player.aimPosition < 0){
			player.aimPosition = 0;
			player.angle = 180;
		}
		else if (player.aimPosition > 8){
			player.aimPosition = 8;
			player.angle = 0;
		}

		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(Img.map, 0, 0);
		draw(player1);
		draw(player2);
		ctx.restore();
	}

	let testCollisionRect = function(rect1,rect2){
		// ctx.strokeRect(rect1.x,rect1.y,rect1.width,rect1.height);
		// ctx.strokeRect(rect2.x + 10,rect2.y + 9,rect2.width - 12,rect2.height);
	    return rect1.x <= rect2.x+rect2.width - 2
	            && rect2.x + 10 <= rect1.x+rect1.width
	            && rect1.y <= rect2.y + rect2.height + 9
	            && rect2.y + 9 <= rect1.y + rect1.height;
	}

	window.addEventListener('keydown', function(){
		if(event.keyCode == 65 && !isGameOver && !isShooting)
			aim(event, curPlayer);
		else if (event.keyCode == 68 && !isGameOver  && !isShooting)
			aim(event, curPlayer);
		else if (event.keyCode == 87 && !isGameOver  && !isShooting)
			curPlayer.power+=5;
		else if (event.keyCode == 83 && !isGameOver  && !isShooting)
			curPlayer.power-=5;
		else if (event.keyCode == 32 && !isGameOver  && !isShooting)
			shootTimer = setInterval( function () {
				shoot(curPlayer);
			}, 18);
	});	

	let gameOver = function (player) {
		console.log('Game over');
		console.log(curPlayer.name + ' wins');

		let gameInfo = document.getElementById('gameInfo');

		let killedPlayer;
		if(curPlayer == player1)
			killedPlayer = player2;
		else
			killedPlayer = player1;


		//params for explosion	
		let explodeFrame = 0,
			explodeCount = 0,
			explodeImg = new Image(),
			explodeWidth = 328,
			explodeHeight = 81;
		explodeImg.src = './img/explode.png';
	
		let explosion = setInterval(function(){
			ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(Img.map, 0, 0);

			//draw explosion
			ctx.drawImage(explodeImg, explodeFrame * explodeWidth / 5, explodeCount * explodeHeight, explodeWidth / 5, explodeHeight, killedPlayer.x, killedPlayer.y - 20, explodeWidth / 5, explodeHeight);

			draw(curPlayer);
			ctx.restore();

			explodeFrame++;
			if(explodeFrame == 5){
				explodeCount++;
				explodeFrame = 0
			}
			if(explodeFrame == 25)
				clearInterval(explosion);

		}, 80);
	}

	let array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 71, 72, 73, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 71, 72, 73, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 71, 72, 73, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let array2D = [],
		mapPositions = [];

	for(let i = 0 ; i < 14; i++){
		array2D[i] = [];
		for(let j = 0 ; j < 28; j++){
			array2D[i][j] = array[i * 28 + j];
			if(array2D[i][j] != 0)
				mapPositions.push([i, j])
		}
	}

	round();
}

game();