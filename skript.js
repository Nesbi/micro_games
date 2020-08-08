// Helper methods
const abs = Math.abs;
const listener = document.addEventListener;
const repeat = (s,n) => s.repeat(n);

// Game
const field = [240,200];
let ball;
let player;
let obstacles;

let levelCounter = 0;
const levels = [
	// Level 1
	// 111111111111
	// 111111111111
	// 111111111111
	// 111111111111
	repeat("1",48),
	
	// Level 2
	// 111111111111
	// 101101101101
	// 101101101101
	// 111111111111
	repeat("1",12)+
	repeat("101",8)+
	repeat("1",12),

    // Level 3
	// 111111111111
	// 100110011001
	// 010010010010
	// 111111111111
	repeat("1",12)+
	repeat("1001",3)+
	repeat("010",4)+
	repeat("1",12),
]

const selectLevel = (next) => {
	ball = [120,150,5,5,0,1]; // [x,y,radius,speed,deltaX,deltaY]
	player = [95,180,50,10,5,false,false]; // [x,y,width,height,speed,LeftArrowDown,RightArrowDown]
	obstacles = [levels[(next? ++levelCounter:levelCounter)%3].split('').flatMap((o,i) =>
					 +o? [[20*(i%12),10*(~~(i/12)%4)]]:[]) // ~~ => Math.floor; Playfield 12*4
					, 20,10]; // [[blocks],width, height]
}

selectLevel();

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
	const normalize = Math.abs(result[0])+Math.abs(result[1]);
	ball[4] = result[0]/normalize;
	ball[5] = result[1]/normalize;
	return true;
}
setInterval(() => {
	if(!ball[5])return false;
	ball[0]+=ball[4]*ball[3];
	ball[1]+=ball[5]*ball[3];
	//bounds
	if(ball[0]-ball[2] <= 0 || ball[0]+ball[2] >= field[0]) ball[4]*=-1; // Left|Right
	if(ball[1]-ball[2] <= 0) ball[5]*=-1; // Top
	if(ball[1]+ball[2] >= field[1]) selectLevel(true); // Bottom
	//player
	collide(player[0],player[1],player[2],player[3]);
	
	//blocks
	result = obstacles[0].findIndex(b => collide(b[0],b[1],obstacles[1],obstacles[2]));
	if(result > -1) obstacles[0].splice(result,1);
	if(obstacles[0].length == 0) selectLevel(true);

	// Player controlls
	player[0] += (player[6] - player[5])*player[4];
}, 50);

// Draw
c = document.body.children[0];
c.height=field[1];
c.width=field[0];
c.style.border = "thick solid #000"
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