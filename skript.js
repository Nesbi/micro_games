
height=200;
width=200;

let ballRadius=5
let ball = [100,150];
let playerHeight = 10;
let playerWidth = 80;
let player = [100-playerWidth/2,160];
let blockWidth = 20;
let blockHeight = 10;
let blocks = [
	[10,10],[30,10],[50,10],[70,10],[90,10],[110,10],[130,10],[150,10],[170,10],
	[10,20],[30,20],[50,20],[70,20],[90,20],[110,20],[130,20],[150,20],[170,20],
	[10,30],[30,30],[50,30],[70,30],[90,30],[110,30],[130,30],[150,30],[170,30],
	[10,40],[30,40],[50,40],[70,40],[90,40],[110,40],[130,40],[150,40],[170,40],
];

//Control
let pDX = 0;
let rDown = false;
let lDown = false;
document.addEventListener("keydown", event => {
	if(event.keyCode == 39) rDown = true; // ArrowRight
	if(event.keyCode == 37) lDown = true; // ArrowLeft
})

document.addEventListener("keyup", event => {
	if(event.keyCode == 39) rDown = false; // ArrowRight
	if(event.keyCode == 37) lDown = false; // ArrowLeft
	console.log("up", event.keyCode);
})
//Physics
let dX = 0;
let dY = 1;

const collide = (xBox, yBox, boxWidth, boxHeight) => {
	// approx ball as rectangle
	if(xBox>=ball[0]+ballRadius || ball[0]-ballRadius>=xBox+boxWidth) return false;
	if(yBox>=ball[1]+ballRadius || ball[1]-ballRadius>=yBox+boxHeight) return false;

	// Collision
	const x = ball[0]-(xBox+boxWidth/2);
	const y = ball[1]-(yBox+boxHeight/2);
	dX = x/Math.abs(x+y);
	dY = y/Math.abs(x+y);
}
setInterval(() => {
	ball[0]+=dX;
	ball[1]+=dY;
	//bounds
	if(ball[0]-ballRadius<=0||ball[0]+ballRadius==width)dX*=-1;//left | right
	if(ball[1]-ballRadius<=0||ball[1]+ballRadius==height)dY*=-1;//top | bottom
	//player
	collide(player[0],player[1],playerWidth,playerHeight);
	
	//blocks
	blocks.forEach(b => collide(b[0],b[1],blockWidth,blockHeight));

	// Player controlls
	player[0] += rDown - lDown;
}, 50);

// Draw
c = document.body.children[0];
c.height=height;
c.width=width;
ctx = c.getContext("2d");
setInterval(() => {
	//clear
	ctx.clearRect(0, 0, c.width, c.height);
	//player
	ctx.fillRect(player[0],player[1],playerWidth,playerHeight);
	//ball
	ctx.beginPath();
	ctx.arc(ball[0],ball[1],ballRadius,0,2*Math.PI);
	ctx.fill();
	//blocks
	blocks.forEach(e=>ctx.fillRect(e[0]+1,e[1]+1,blockWidth-2,blockHeight-2));
}, 100);