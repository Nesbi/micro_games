// Helper methods
const abs = Math.abs;
const listener = document.addEventListener;

// Game
let field;
let ball;
let player;
let obstacles;

const levels = [
	// Level 1
	"1111111111"+
	"1111111111"+
	"1111111111",
	// Level 2
	"1111111111"+
	"1000110001"+
	"1111111111",
    // Level 3
	"1111111111"+
	"1011001101"+
	"1000110001"+
	"1101001011"
]

const selectLevel = (level) => {
	field = [200,200];
	ball = [100,150,5,5,0,1]; // [x,y,radius,speed,deltaX,deltaY]
	player = [60,160,80,10,5,false,false]; // [x,y,width,height,speed,LeftArrowDown,RightArrowDown]
	obstacles = [
		[
			[10,10],[30,10],[50,10],[70,10],[90,10],[110,10],[130,10],[150,10],[170,10],
			[10,20],[30,20],[50,20],[70,20],[90,20],[110,20],[130,20],[150,20],[170,20],
			[10,30],[30,30],[50,30],[70,30],[90,30],[110,30],[130,30],[150,30],[170,30],
			[10,40],[30,40],[50,40],[70,40],[90,40],[110,40],[130,40],[150,40],[170,40]
		], 20,10,
	]; // [[blocks],width, height]
	levels[level].split('').map((o,i) => +o? [10*(i%10),Math.round(i/10)]:[])
}

selectLevel(0);

//Control
listener("keydown", e => {
	if(e.keyCode == 37) player[5] = true; // ArrowLeft
	if(e.keyCode == 39) player[6] = true; // ArrowRight
})

listener("keyup", e => {
	if(e.keyCode == 37) player[5] = false; // ArrowLeft
	if(e.keyCode == 39) player[6] = false; // ArrowRight
})
//Physics
const collide = (x, y, width, height) => {
	// approx ball as rectangle
	if(x>=ball[0]+ball[2] || ball[0]-ball[2]>=x+width) return false;
	if(y>=ball[1]+ball[2] || ball[1]-ball[2]>=y+height) return false;

	// Collision
	const result = [ball[0]-(x+width/2), ball[1]-(y+height/2)];
	const normalize = abs(result[0])+abs(result[1]);
	ball[4] = result[0]/normalize;
	ball[5] = result[1]/normalize;
	return true;
}
setInterval(() => {
	ball[0]+=ball[4]*ball[3];
	ball[1]+=ball[5]*ball[3];
	//bounds
	if(ball[0]-ball[2] <= 0 || ball[0]+ball[2] >= field[0]) ball[4]*=-1; // Left|Right
	if(ball[1]-ball[2] <= 0) ball[5]*=-1; // Top
	if(ball[1]+ball[2] >= field[1]) selectLevel(0); // Bottom
	//player
	collide(player[0],player[1],player[2],player[3]);
	
	//blocks
	result = obstacles[0].findIndex(b => collide(b[0],b[1],obstacles[1],obstacles[2]));
	if(result > -1) obstacles[0].splice(result,1);

	// Player controlls
	player[0] += (player[6] - player[5])*player[4];
}, 50);

// Draw
c = document.body.children[0];
c.height=field[1];
c.width=field[0];
ctx = c.getContext("2d");
setInterval(() => {
	//clear
	ctx.clearRect(0, 0, c.width, c.height);
	//player
	ctx.fillRect(player[0],player[1],player[2],player[3]);
	//ball
	ctx.beginPath();
	ctx.arc(ball[0],ball[1],ball[2],0,2*Math.PI);
	ctx.fill();
	//blocks
	obstacles[0].forEach(element => ctx.fillRect(element[0]+1,element[1]+1,obstacles[1]-2,obstacles[2]-2));
}, 100);