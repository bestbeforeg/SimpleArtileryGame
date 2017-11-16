function game() {
	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		player = {
			x: 20,
			y: 20,
			angle : 0,
			power : 0,
		};

	player.img = new Image();
	player.img.src = './img/tank.png';
	player.draw = function(){
		ctx.drawImage(player.img, 0, 0, player.img.width / 9, player.img.height, player.x, player.y, player.img.width / 9, player.img.height);
	}
	player.img.onload = player.draw;	
}

game();