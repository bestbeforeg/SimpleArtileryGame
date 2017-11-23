function game() {
	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		gravity = 9.81,
		turn = 1,
		isGameOver = false,
		shootTimer,
		shell = {
			posX : [6,8,19,28,32,39,45,55,61],
			posY : [18,6,1,-1,1,-1,1,5,16],
			x : 0,
			y : 0,
			framePosition : 0,
			t : 0,
		};
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
			x: 0,
			y: 0,
			angle : 180,
			stepAngle : 22.5,
			power : 80,
			aimPosition : 0,
			img : Img.player1,
		},
		player2 = {
			x: 0,
			y: 0,
			angle : 180,
			stepAngle : 22.5,
			power : 80,
			aimPosition : 0,
			img : Img.player2,
		};	

	let	curPlayer;
	if(turn % 2 == 0)
		curPlayer = player2;
	else
		curPlayer = player1;

	draw = function (player){
		ctx.drawImage(player.img, player.aimPosition * (player1.img.width / 9), 0, player1.img.width / 9, player1.img.height, player.x, player.y, player1.img.width / 9, player1.img.height);
	}

	position = function(player){
		let randomPos = Math.round(Math.random() * (mapPositions.length -1));
		player.x = mapPositions[randomPos][1] * 32;
		player.y = mapPositions[randomPos][0] * 32 - (player.img.height - 17);
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

	shoot = function(player){
		//calculate trajectory
		let vx = player.power * Math.cos(player.angle/180*Math.PI),
			vy = player.power * Math.sin(player.angle/180*Math.PI);
		shell.t +=0.08;
		shell.x = shell.posX[player.aimPosition] + player.x + vx*shell.t;
		shell.y = shell.posY[player.aimPosition] + player.y - (vy*shell.t - (gravity/2)*shell.t*shell.t);
		
		ctx.save();
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(Img.map, 0, 0);
		draw(player1);
		draw(player2);
		ctx.drawImage(Img.shell, shell.framePosition * Img.shell.width / 19, 0, Img.shell.width / 19, Img.shell.height, shell.x, shell.y, Img.shell.width / 19, Img.shell.height);
		ctx.restore();

		if(Math.ceil(shell.t) % 2 == 0)
			shell.framePosition ++;

		if (shell.y > canvas.height || shell.y + Img.shell.width < 0 || shell.x > canvas.width || shell.x + Img.shell.width < 0){
			return;
		}

		if(shell.framePosition > 18)
			shell.framePosition = 18;
	}

	Img.map.onload = function () {
		ctx.drawImage(Img.map, 0, 0);
		position(player1);
		draw(player1);
		position(player2);
		draw(player2);
	}

	aim = function(event, player){
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

	window.addEventListener('keydown', function(){
		if(event.keyCode == 65)
			aim(event, curPlayer);
		else if (event.keyCode == 68)
			aim(event, curPlayer);
		else if (event.keyCode == 87)
			curPlayer.power+=5;
		else if (event.keyCode == 83)
			curPlayer.power-=5;
		else if (event.keyCode == 32)
			shootTimer = setInterval( function () {
				shoot(curPlayer);
			}, 18);
	});

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

	
	console.log(mapPositions);
}

game();