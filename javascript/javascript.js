var canvas;
var context;
var x = 75;
var y = 50;
var dragok = false;

function rect(x, y, w, h) {
	context.beginPath();
	context.rect(x, y, w, h);
	context.closePath();
	context.fill();
}

function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
	canvas = document.getElementById("canvas");
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	canvas.onmousedown = myDown;
	canvas.onmouseup = myUp;
	context = canvas.getContext("2d");
	return setInterval(draw, 1);
}

function draw() {
	clear();
	context.fillStyle = "#FAF7F8";
	rect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#444444";
	rect(x - 15, y - 15, 30, 30);
}

function myMove(e) {
	if (dragok) {
		x = e.pageX - canvas.offsetLeft;
		y = e.pageY - canvas.offsetTop;
	}
}

function myDown(e) {
	if (e.pageX < x + 15 + canvas.offsetLeft
			&& e.pageX > x - 15 + canvas.offsetLeft
			&& e.pageY < y + 15 + canvas.offsetTop
			&& e.pageY > y - 15 + canvas.offsetTop) {
		x = e.pageX - canvas.offsetLeft;
		y = e.pageY - canvas.offsetTop;
		dragok = true;
		canvas.onmousemove = myMove;
	}
}

function myUp() {
	dragok = false;
	canvas.onmousemove = null;
}

init();
