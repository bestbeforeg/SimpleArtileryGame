function game() {
	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		gravity = 9.81,
		player = {
			x: 250,
			y: 350,
			angle : 180,
			stepAngle : 22.5,
			power : 100,
			aimPosition : 0,
		};
	ctx.mozImageSmoothingEnabled = false; //better graphics for pixel art
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	window.addEventListener('keydown', function(){
		if (event.keyCode == 65)
			aim(event);
		else if (event.keyCode == 68)
			aim(event);
		else if (event.keyCode == 32)
			player.shoot();
	});
	player.img = new Image();
	player.img.src = './img/tank.png';
	player.draw = function(){
		ctx.drawImage(player.img, player.aimPosition * (player.img.width / 9), 0, player.img.width / 9, player.img.height, player.x, player.y, player.img.width / 9, player.img.height);
	}
	player.img.onload = player.draw;

	let shell = {
		posX : [6,8,15,24,31,37,45,55,60],
		posY : [18,8,3,2,4,4,4,5,18],
		x : 0,
		y : 0,
		framePosition : 0,
		t : 0,
	}
	shell.img = new Image();
	shell.img.src = './img/shell.png';
	player.shoot = function(){
		if (shell.y > canvas.height || shell.y < 0 || shell.x > canvas.width || shell.x < 0)
			return;
		if(shell.framePosition > 18)
			shell.framePosition = 18;
		let vx = player.power * Math.cos(player.angle/180*Math.PI),
			vy = player.power * Math.sin(player.angle/180*Math.PI);
		shell.t +=0.08;
		shell.x = shell.posX[player.aimPosition] + player.x + vx*shell.t;
		shell.y = shell.posY[player.aimPosition] + player.y - (vy*shell.t - (gravity/2)*shell.t*shell.t);
		
		ctx.save();
		ctx.clearRect(0, 0, 800, 600);
		player.draw();
		ctx.drawImage(shell.img, shell.framePosition * shell.img.width / 19, 0, shell.img.width / 19, shell.img.height, shell.x, shell.y, shell.img.width / 19, shell.img.height);
		ctx.restore();
		if(Math.ceil(shell.t) % 2 == 0)
			shell.framePosition ++;
		requestAnimationFrame(player.shoot);
	}	

	function aim(event){
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

		shell.x = shell.posX[player.aimPosition];
		shell.y = shell.posY[player.aimPosition];

		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(player.img, player.aimPosition * (player.img.width / 9), 0, (player.img.width / 9), player.img.height, player.x, player.y, player.img.width / 9, player.img.height);
		ctx.restore();

		console.log(shell.x + ' ' + shell.y);
		console.log(Math.floor(player.angle));

	}
}

game();