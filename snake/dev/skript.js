// Helper methods
const abs = Math.abs;
const listener = document.addEventListener;
const repeat = (s,n) => s.repeat(n);

// Game
const field = [240,200];
const blockSize = 10;
let player = [[10,10]];
let consumed = 6;
let curDirection = 0; // 0:Left, 1:Up, 2:Right, 3:Down
let nextDirection = 0; // 0:Left, 1:Up, 2:Right, 3:Down
//Control
listener("keydown", e => {
	if(e.keyCode == 37) nextDirection = 0; // ArrowLeft
	if(e.keyCode == 38) nextDirection = 1; // ArrowUp
	if(e.keyCode == 39) nextDirection = 2; // ArrowRight
	if(e.keyCode == 40) nextDirection = 3; // ArrowDown
})

//Physics
const collide = (x, y, width, height) => {
	// approx ball as rectangle
	if(x>=ball[0]+ball[2] || ball[0]-ball[2]>=x+width) return false;
	if(y>=ball[1]+ball[2] || ball[1]-ball[2]>=y+height) return false;

	// Collision
	const result = [ball[0]-(x+width/2), ball[1]-(y+height/2)];
	const normalize = Math.abs(result[0])+Math.abs(result[1]);
	ball[4] = result[0]/normalize;
	ball[5] = result[1]/normalize;
	return true;
}
setInterval(() => {
	//player
	if((nextDirection+2) % 4 != curDirection) curDirection = nextDirection; // block moving backwards
	let head = player[0];
	switch(curDirection) {
		case 0: //Left
		player.unshift([head[0]-1,head[1]])
		break;
		case 1: //Up
		player.unshift([head[0],head[1]-1])
		break;
		case 2: //Right
		player.unshift([head[0]+1,head[1]])
		break;
		case 3: //Down
		player.unshift([head[0],head[1]+1])
		break;
	}
	if(consumed > 0) {
		consumed--;
	} else {
		player.pop();
	}

	curDirection = nextDirection;
//	collide(player[0],player[1],player[2],player[3]);
}, 500);

// Draw
c = document.body.children[0];
c.height=field[1];
c.width=field[0];
c.style.border = "thick solid #000"
ctx = c.getContext("2d");
setInterval(() => {
	//clear
	ctx.clearRect(0, 0, c.width, c.height);

	//blocks
	player.forEach(segment => ctx.fillRect(segment[0]*blockSize,segment[1]*blockSize,blockSize,blockSize));
}, 100);