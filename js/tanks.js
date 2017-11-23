function game() {

	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		gravity = 9.81,
		Img = {
			player : new Image(),
			shell : new Image(),
			map : new Image(),
		};
	Img.player.src = './img/tank.png';
	Img.shell.src = './img/shell.png';
	Img.map.src = './img/map.png';
		player = {
			x: 140,
			y: 78,
			angle : 180,
			stepAngle : 22.5,
			power : 80,
			aimPosition : 0,
		},
		shell = {
			posX : [6,8,19,28,32,39,45,55,61],
			posY : [18,6,1,-1,1,-1,1,5,16],
			x : 0,
			y : 0,
			framePosition : 0,
			t : 0,
		};

	ctx.mozImageSmoothingEnabled = false; //better graphics for pixel art
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	window.addEventListener('keydown', function(){
		if (event.keyCode == 65)
			aim(event);
		else if (event.keyCode == 68)
			aim(event);
		else if (event.keyCode == 87)
			player.power+=5;
		else if (event.keyCode == 83)
			player.power-=5;
		else if (event.keyCode == 32)
			player.shoot();
	});


	player.draw = function(){
		ctx.drawImage(Img.player, player.aimPosition * (Img.player.width / 9), 0, Img.player.width / 9, Img.player.height, player.x, player.y, Img.player.width / 9, Img.player.height);
	}
	Img.map.onload = function () {
		ctx.drawImage(Img.map, 0, 0);
		player.draw();
	}	

	player.shoot = function(){
		if (shell.y > canvas.height || shell.y < 0 || shell.x > canvas.width || shell.x < 0)
			return;
		if(shell.framePosition > 18)
			shell.framePosition = 18;

		//calculate trajectory
		let vx = player.power * Math.cos(player.angle/180*Math.PI),
			vy = player.power * Math.sin(player.angle/180*Math.PI);
		shell.t +=0.08;
		shell.x = shell.posX[player.aimPosition] + player.x + vx*shell.t;
		shell.y = shell.posY[player.aimPosition] + player.y - (vy*shell.t - (gravity/2)*shell.t*shell.t);
		
		ctx.save();
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(Img.map, 0, 0);
		player.draw();
		ctx.drawImage(Img.shell, shell.framePosition * Img.shell.width / 19, 0, Img.shell.width / 19, Img.shell.height, shell.x, shell.y, Img.shell.width / 19, Img.shell.height);
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

		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(Img.map, 0, 0);
		ctx.drawImage(Img.player, player.aimPosition * (Img.player.width / 9), 0, (Img.player.width / 9), Img.player.height, player.x, player.y, Img.player.width / 9, Img.player.height);
		ctx.restore();
		console.log(Math.floor(player.angle));
	}



	console.log(canvas.width)
	var array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 71, 72, 73, 74, 75, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 71, 72, 73, 74, 75, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 71, 72, 73, 74, 75, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var array2D = [];
	for(var i = 0 ; i < 14; i++){
		array2D[i] = [];
		for(var j = 0 ; j < 28; j++){
			array2D[i][j] = array[i * 28 + j];
		}
	}

	console.log(array2D);


// parameters - change to your liking
 // var STEP_MAX = 2.5;
 // var STEP_CHANGE = 1.0;
 // var HEIGHT_MAX = canvas.height;

 // // starting conditions
 // var height = Math.random() * HEIGHT_MAX;
 // var slope = (Math.random() * STEP_MAX) * 2 - STEP_MAX;

 // // creating the landscape
 // for (var x = 0; x < canvas.width; x++) {
 //      // change height and slope
 //      height += slope;
 //      slope += (Math.random() * STEP_CHANGE) * 2 - STEP_CHANGE;

 //      // clip height and slope to maximum
 //      if (slope > STEP_MAX) { slope = STEP_MAX };
 //      if (slope < -STEP_MAX) { slope = -STEP_MAX };
 
 //      if (height > HEIGHT_MAX) { 
 //          height = HEIGHT_MAX;
 //          slope *= -1;
 //      }
 //      if (height < 0) { 
 //          height = 0;
 //          slope *= -1;
 //      }
      
 //      // draw column
 //      ctx.beginPath();
 //      ctx.moveTo(x, HEIGHT_MAX);
 //      ctx.lineTo(x, height);
 //      ctx.stroke();
 // }
}

game();