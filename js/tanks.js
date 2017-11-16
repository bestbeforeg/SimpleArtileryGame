function game() {
	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		player = {
			x: 20,
			y: 20,
			angle : 0,
			stepAngle : 22.5,
			power : 0,
			aimPosition : 0,
		};

	player.img = new Image();
	player.img.src = './img/tank.png';
	player.draw = function(){
		ctx.drawImage(player.img, 0, 0, player.img.width / 9, player.img.height, player.x, player.y, player.img.width / 9, player.img.height);
	}
	player.img.onload = player.draw;

	window.addEventListener('keydown', function(){
		if (event.keyCode == 39)
			aim(event);
		else if (event.keyCode == 37)
			aim(event);
	});

	function aim(event){
		if (event.keyCode == 39) {
			player.aimPosition ++;
			player.angle = player.aimPosition * player.stepAngle;
		}
		else if(event.keyCode == 37){
			player.aimPosition --;
			player.angle = player.aimPosition * player.stepAngle;
		}

		if(player.aimPosition < 0){
			player.aimPosition = 0;
			player.angle = 0;
		}
		else if (player.aimPosition > 8){
			player.aimPosition = 8;
			player.angle = 180;
		}

		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(player.img, player.aimPosition * (player.img.width / 9), 0, (player.img.width / 9), player.img.height, player.x, player.y, player.img.width / 9, player.img.height);
		console.log(player.angle);
		ctx.restore();
	}
}

game();