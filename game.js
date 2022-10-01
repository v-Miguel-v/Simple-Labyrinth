"use strict";
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

/* Initial Values */
let canvasSize = null;
let gridSize = null;
let elementsSize = null;
const MAP_LIMITS = {
	UP: 1,
	LEFT: 1,
	RIGHT: 10,
	DOWN: 10
};
const playerPos = {
	x: null,
	y: null
};
const giftPos = {
	x: null,
	y: null
}
let actualLevel = 0;

/* Event Listeners */
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
window.addEventListener("keydown", moveByKeys);
document.getElementById("up").addEventListener("click", moveByClicks);
document.getElementById("left").addEventListener("click", moveByClicks);;
document.getElementById("right").addEventListener("click", moveByClicks);;
document.getElementById("down").addEventListener("click", moveByClicks);;

/* Game Logic */
function setCanvasSize() {
	if (window.innerHeight < window.innerWidth) {
		canvasSize = window.innerHeight * 0.8;
	} else {
		canvasSize = window.innerWidth * 0.8;
	}
	renderMap();
}

function renderMap() {
	canvasSize = Math.trunc(canvasSize);
	canvas.setAttribute("width", canvasSize);
	canvas.setAttribute("height", canvasSize);
	
	gridSize = Math.trunc(canvasSize / 10);
	elementsSize = gridSize;
	// console.log( {canvasSize, gridSize, elementsSize} );
	
	game.textAlign = "start"
	game.font = `${elementsSize}px sans-serif`;
	
	let actualMap = maps[actualLevel];
	const mapRows = actualMap.trim().split("\n");
	const mapElements = mapRows.map(row => row.trim().split(""));
	
	game.clearRect(0,0, canvasSize, canvasSize);
	let firstLoad = (playerPos.x === null && playerPos.y === null);
	let playerMoved = (playerPos.x !== null && playerPos.y !== null);
	
	mapElements.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = colIndex * gridSize; // 0 ~ 9
			const posY = (rowIndex+1) * gridSize; // 1 ~ 10
			game.fillText(emoji, posX, posY);

			if (emoji === "🚪" && firstLoad) {
				playerPos.x = (colIndex+1);
				playerPos.y = (rowIndex+1);
				game.fillText(emojis["PLAYER"], posX, posY);
				console.log(`Jugador (${playerPos.x}, ${playerPos.y})`);
			}
			
			if (emoji === "🎁") {
				giftPos.x = (colIndex+1);
				giftPos.y = (rowIndex+1);
				firstLoad && console.log(`Regalito (${giftPos.x}, ${giftPos.y})`);
			}
			
			
		})
	});
	
	if (playerMoved) {
		const posX = (playerPos.x-1) * gridSize; // 0 ~ 9
		const posY = playerPos.y * gridSize; // 1 ~ 10
		game.fillText(emojis["PLAYER"], posX, posY);
		
		const wasTheLevelComplete = (playerPos.x === giftPos.x) && (playerPos.y === giftPos.y);
		if (wasTheLevelComplete) {
			actualLevel++;
			
			playerPos.x = null;
			playerPos.y = null;
			
			giftPos.x = null;
			giftPos.y = null;
			
			renderMap();
		} 
	}
}

function movePlayer(direction) {
	
	switch(direction) {
		case "up":
			if ( (playerPos.y - 1) >= MAP_LIMITS.UP ) {
				playerPos.y--;
				renderMap();
			}
			break;
			
		case "left":
			if ( (playerPos.x - 1) >= MAP_LIMITS.LEFT) {
				playerPos.x--;
				renderMap();
			}
			break;
			
		case "right":
			if ( (playerPos.x + 1) <= MAP_LIMITS.RIGHT) {
				playerPos.x++;
				renderMap();
			}
			break;
			
		case "down":
			if ( (playerPos.y + 1) <= MAP_LIMITS.DOWN) {
				playerPos.y++;
				renderMap();
			}
			break;
	}
	
	console.log(`Jugador (${playerPos.x}, ${playerPos.y})`);
}

function moveByClicks(clickEvent) {
	switch (clickEvent.target.id) {
		case "up":
			movePlayer("up");
			// console.log("arriba");
			break;
		case "left":
			movePlayer("left");
			// console.log("izquierda");
			break;
		case "right":
			movePlayer("right");
			// console.log("derecha");
			break;
		case "down":
			movePlayer("down");
			// console.log("abajo");
			break;
	}
};

function moveByKeys(keyEvent) {
	switch (keyEvent.code){
		case "ArrowUp":
			movePlayer("up");
			// console.log("arriba");
			break;
		case "ArrowLeft":
			movePlayer("left");
			// console.log("izquierda");
			break;
		case "ArrowRight":
			movePlayer("right");
			// console.log("derecha");
			break;
		case "ArrowDown":
			movePlayer("down");
			// console.log("abajo");
			break;
			
			
		case "KeyW":
			movePlayer("up");
			// console.log("arriba");
			break;
		case "KeyA":
			movePlayer("left");
			// console.log("izquierda");
			break;
		case "KeyD":
			movePlayer("right");
			// console.log("derecha");
			break;
		case "KeyS":
			movePlayer("down");
			// console.log("abajo");
			break;
	}
}