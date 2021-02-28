// Helper methods
const abs = Math.abs;
const listener = document.addEventListener;
const repeat = (s,n) => s.repeat(n);

// Game
const field = [24,20];
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
let stop = false;
setInterval(() => {
	if(!stop){
		//player
		if((nextDirection+2) % 4 != curDirection) curDirection = nextDirection; // block moving backwards
		const x = curDirection == 0 ? -1 : (curDirection==2 ? 1 : 0);
		const y = curDirection == 1 ? -1 : (curDirection==3 ? 1 : 0);
		let head = [player[0][0]+x,player[0][1]+y];
		stop = player.find(p => p[0] == head[0] && p[1] == head[1]) ? true : stop; // stop on self collide	
		stop = head[0] < 0 || head[0] > field[0] || head[1] < 0 || head[1] > field[1] ? true : stop; // stop on border collide
		player.unshift(head)

		if(consumed > 0) {
			consumed--;
		} else {
			player.pop();
		}
	}

//	collide(player[0],player[1],player[2],player[3]);
}, 500);

// Draw
c = document.body.children[0];
c.height=field[1]*blockSize;
c.width=field[0]*blockSize;
c.style.border = "thick solid #000"
ctx = c.getContext("2d");
setInterval(() => {
	//clear
	ctx.clearRect(0, 0, c.width, c.height);

	//blocks
	player.forEach(segment => ctx.fillRect(segment[0]*blockSize,segment[1]*blockSize,blockSize,blockSize));
}, 100);