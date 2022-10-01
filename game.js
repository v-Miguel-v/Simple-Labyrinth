"use strict";

const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
let canvasSize = null;
let gridSize = null;
let elementsSize = null;
let playerPos = {
	x: null,
	y: null
};
let mapLimits = {
	up: null,
	left: null,
	right: null,
	down: null
};

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
window.addEventListener("keydown", moveByKeys);
document.getElementById("up").addEventListener("click", moveByClicks);
document.getElementById("left").addEventListener("click", moveByClicks);;
document.getElementById("right").addEventListener("click", moveByClicks);;
document.getElementById("down").addEventListener("click", moveByClicks);;

function setCanvasSize() {
	if (window.innerHeight < window.innerWidth) {
		canvasSize = window.innerHeight * 0.8;
	} else {
		canvasSize = window.innerWidth * 0.8;
	}
	renderMap();
}

function renderMap() {
	canvasSize = canvasSize; // Math.round();
	canvas.setAttribute("width", canvasSize);
	canvas.setAttribute("height", canvasSize);
	
	gridSize = canvasSize / 10;
	elementsSize = gridSize;
	// console.log( {canvasSize, gridSize, elementsSize} );
	
	mapLimits.up = gridSize * 1;
	mapLimits.left = gridSize * 0;
	mapLimits.right = gridSize * 9;
	mapLimits.down = gridSize * 10;
	// console.log (mapLimits);
	
	game.textAlign = "start"
	game.font = `${elementsSize}px sans-serif`;
	
	let actualMap = maps[0];
	const mapRows = actualMap.trim().split("\n");
	const mapElements = mapRows.map(row => row.trim().split(""));
	
	game.clearRect(0,0, canvasSize, canvasSize);
	mapElements.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = colIndex * gridSize;
			const posY = (rowIndex+1) * gridSize;
			game.fillText(emoji, posX, posY);
			// console.log( {rowIndex, colIndex} );
			
			let firstTime = (playerPos.x === null && playerPos.y === null);
			if (emoji === "🚪" && firstTime) {
				playerPos.x = posX;
				playerPos.y = posY;
				game.fillText(emojis["PLAYER"], playerPos.x, playerPos.y);
				console.log(playerPos);
			}
		})
	});
}

function movePlayer(direction) {
	function renderPlayer() {
		renderMap();
		game.fillText(emojis["PLAYER"], playerPos.x, playerPos.y);
	}	
	
	switch(direction) {
		case "up":
			if ( (playerPos.y - gridSize) >= mapLimits.up ) {
				playerPos.y -= gridSize;
				renderPlayer();
			}
			console.log(playerPos);
			break;
			
		case "left":
			if ( (playerPos.x - gridSize) >= mapLimits.left) {
				playerPos.x -= gridSize;
				renderPlayer();
			}
			console.log(playerPos);
			break;
			
		case "right":
			if ( (playerPos.x + gridSize) <= mapLimits.right) {
				playerPos.x += gridSize;
				renderPlayer();
			}
			console.log(playerPos);
			break;
			
		case "down":
			if ( (playerPos.y + gridSize) <= mapLimits.down) {
				playerPos.y += gridSize;
				renderPlayer();
			}
			console.log(playerPos);
			break;
	}
}

function moveByClicks(clickEvent) {
	switch (clickEvent.target.id) {
		case "up":
			movePlayer("up");
			console.log("arriba");
			break;
		case "left":
			movePlayer("left");
			console.log("izquierda");
			break;
		case "right":
			movePlayer("right");
			console.log("derecha");
			break;
		case "down":
			movePlayer("down");
			console.log("abajo");
			break;
	}
};

function moveByKeys(keyEvent) {
	switch (keyEvent.code){
		case "ArrowUp":
			movePlayer("up");
			console.log("arriba");
			break;
		case "ArrowLeft":
			movePlayer("left");
			console.log("izquierda");
			break;
		case "ArrowRight":
			movePlayer("right");
			console.log("derecha");
			break;
		case "ArrowDown":
			movePlayer("down");
			console.log("abajo");
			break;
			
			
		case "KeyW":
			movePlayer("up");
			console.log("arriba");
			break;
		case "KeyA":
			movePlayer("left");
			console.log("izquierda");
			break;
		case "KeyD":
			movePlayer("right");
			console.log("derecha");
			break;
		case "KeyS":
			movePlayer("down");
			console.log("abajo");
			break;
	}
}