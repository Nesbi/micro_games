height=200;
width=200;
let ball;
let player;
let blocks;

reset = () => {
	ball = [100,150,5,5,0,1]; // [x,y,radius,speed,deltaX,deltaY]
	player = [60,160,80,10,5,false,false]; // [x,y,width,height,speed,LeftArrowDown,RightArrowDown]
	blocks = [
		[
			[10,10],[30,10],[50,10],[70,10],[90,10],[110,10],[130,10],[150,10],[170,10],
			[10,20],[30,20],[50,20],[70,20],[90,20],[110,20],[130,20],[150,20],[170,20],
			[10,30],[30,30],[50,30],[70,30],[90,30],[110,30],[130,30],[150,30],[170,30],
			[10,40],[30,40],[50,40],[70,40],[90,40],[110,40],[130,40],[150,40],[170,40]
		], 20,10,
	]; // [[blocks],width, height]
}

reset();

//Control
document.addEventListener("keydown", event => {
	if(event.keyCode == 37) player[5] = true; // ArrowLeft
	if(event.keyCode == 39) player[6] = true; // ArrowRight
})

document.addEventListener("keyup", event => {
	if(event.keyCode == 37) player[5] = false; // ArrowLeft
	if(event.keyCode == 39) player[6] = false; // ArrowRight
})
//Physics
const collide = (xBox, yBox, boxWidth, boxHeight) => {
	// approx ball as rectangle
	if(xBox>=ball[0]+ball[2] || ball[0]-ball[2]>=xBox+boxWidth) return false;
	if(yBox>=ball[1]+ball[2] || ball[1]-ball[2]>=yBox+boxHeight) return false;

	// Collision
	const x = ball[0]-(xBox+boxWidth/2);
	const y = ball[1]-(yBox+boxHeight/2);
	ball[4] = x/(Math.abs(x)+Math.abs(y));
	ball[5] = y/(Math.abs(x)+Math.abs(y));
	return true;
}
setInterval(() => {
	ball[0]+=ball[4]*ball[3];
	ball[1]+=ball[5]*ball[3];
	//bounds
	if(ball[0]-ball[2]<=0||ball[0]+ball[2]>=width) ball[4]*=-1; // Left|Right
	if(ball[1]-ball[2]<=0) ball[5]*=-1 // Top
	if(ball[1]+ball[2]>=height) reset() // Bottom
	//player
	collide(player[0],player[1],player[2],player[3]);
	
	//blocks
	result = blocks[0].findIndex(b => collide(b[0],b[1],blocks[1],blocks[2]));
	if(result > -1) blocks[0].splice(result,1);

	// Player controlls
	player[0] += (player[6] - player[5])*player[4];
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
	ctx.fillRect(player[0],player[1],player[2],player[3]);
	//ball
	ctx.beginPath();
	ctx.arc(ball[0],ball[1],ball[2],0,2*Math.PI);
	ctx.fill();
	//blocks
	blocks[0].forEach(e=>ctx.fillRect(e[0]+1,e[1]+1,blocks[1]-2,blocks[2]-2));
}, 100);