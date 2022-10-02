"use strict";
const timeShown = document.querySelector("#time");
const livesShown = document.querySelector("#lives");
const recordShown = document.querySelector("#record");
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

class ItemPos {
	constructor(posX = null, posY = null) {
		this.x = posX;
		this.y = posY;
	}
}

/* Initial Values */
let canvasSize = null;
let gridSize = null;
let elementsSize = null;

const playerPos = new ItemPos();
const giftPos = new ItemPos();
let bombsPos = [];

let currentLevel = 0;
let currentLives = 5;
let totalGameTime = 0;
const lastLevel = maps.length - 1;
let currentRecord = Number(localStorage.getItem("record"));

timeShown.innerText = "-- -- --";
livesShown.innerText = emojis["HEART"].repeat(currentLives);
currentRecord ? recordShown.innerText = formatSeconds(currentRecord) : recordShown.innerText = "-- -- --";

const MAP_LIMITS = {
	UP: 1,
	LEFT: 1,
	RIGHT: 10,
	DOWN: 10
};

/* Event Listeners */
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
window.addEventListener("keydown", moveByKeys);
document.getElementById("up").addEventListener("click", moveByClicks);
document.getElementById("left").addEventListener("click", moveByClicks);;
document.getElementById("right").addEventListener("click", moveByClicks);;
document.getElementById("down").addEventListener("click", moveByClicks);;

/* Game Logic */
let currentTimer = null;
function startTimer() {
	currentTimer = setInterval( () => {
		totalGameTime++;
		const currentTime = formatSeconds(totalGameTime);
		timeShown.innerText = currentTime;
	}, 1000 );
}

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
	
	let actualMap = maps[currentLevel];
	const mapRows = actualMap.trim().split("\n");
	const mapElements = mapRows.map(row => row.trim().split(""));
	
	game.clearRect(0,0, canvasSize, canvasSize);
	let isFirstLoad = (playerPos.x === null && playerPos.y === null);
	let playerMoved = (playerPos.x !== null && playerPos.y !== null);
	
	mapElements.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = colIndex * gridSize; // 0 ~ 9
			const posY = (rowIndex+1) * gridSize; // 1 ~ 10
			game.fillText(emoji, posX, posY);

			if (isFirstLoad) {
				switch(emoji) {
					case "🚪":
						playerPos.x = (colIndex+1);
						playerPos.y = (rowIndex+1);
						game.fillText(emojis["PLAYER"], posX, posY);
						// console.log(`Jugador (${playerPos.x}, ${playerPos.y})`);
						break;
						
					case "🎁":
						giftPos.x = (colIndex+1);
						giftPos.y = (rowIndex+1);
						// console.log(`Regalito (${giftPos.x}, ${giftPos.y})`);
						break;
						
					case "💣":
						bombsPos.push(new ItemPos( (colIndex+1),(rowIndex+1) ));
						break;
				}
			}
		})
	});
	
	if (playerMoved) {
		const posX = (playerPos.x-1) * gridSize; // 0 ~ 9
		const posY = playerPos.y * gridSize; // 1 ~ 10
		game.fillText(emojis["PLAYER"], posX, posY);
		
		wasAnyBombHit();
		wasTheLevelComplete();
	}
}

/* Player Movement */
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
	
	// console.log(`Jugador (${playerPos.x}, ${playerPos.y})`);
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

/* Win and Lose Conditions */
function wasTheLevelComplete() { // Win Condition
	const itWas = (playerPos.x === giftPos.x) && (playerPos.y === giftPos.y);
	if (itWas) {
		if (currentLevel !== lastLevel) {
			console.log("Pasaste de Nivel~");
			resetAllPositions();
			currentLevel++;
			renderMap();
		} else {
			gameWon();
		}
	}
}

function wasAnyBombHit() { // Lose Condition
	const itWas = bombsPos.find(bomb => ( (bomb.x === playerPos.x) && (bomb.y === playerPos.y) ));
	if (itWas) {
		currentLives--;
		updateLivesShown();
		if (currentLives === 0) gameLost();
		resetAllPositions();
		renderMap();
	}
}

function gameLost() {
	console.log("Perdiste todas tus vidas. Empiezas desde el nivel 1");
	currentLevel = 0;
	currentLives = 5;
	livesShown.innerText = emojis["HEART"].repeat(currentLives);
}

function gameWon() {
	console.log("¡Ganaste el Juego!");
	clearInterval(currentTimer);
	
	if (totalGameTime < currentRecord) {
		currentRecord = totalGameTime;
		localStorage.setItem("record", totalGameTime);
		recordShown.innerText = formatSeconds(currentRecord);
	}
}

/* Helpers */
function resetAllPositions() {
	playerPos.x = null;
	playerPos.y = null;
	
	giftPos.x = null;
	giftPos.y = null;
	
	bombsPos = [];
}

function updateLivesShown() {
	livesShown.innerText = emojis["HEART"].repeat(currentLives);
}

function formatSeconds(timeInSeconds) {
	const totalTime = {
		hrs: 0,
		min: 0,
		sec: 0
	};
	
	let counter = timeInSeconds;
	while (counter > 0) {
		if (counter >= 3600) {
			totalTime.hrs = Math.trunc(counter/3600);
			counter -= 3600 * Math.trunc(counter/3600);
		} else if (counter >= 60) {
			totalTime.min = Math.trunc(counter/60);
			counter -= 60 * Math.trunc(counter/60);
		} else if (counter >= 1) {
			totalTime.sec = counter;
			counter -= counter;
		}
	}
	
	let totalTimeInString = "";
	if (totalTime.hrs > 0) totalTimeInString += `${totalTime.hrs} h `;
	if (totalTime.min > 0) totalTimeInString += `${totalTime.min} min `;
	if (totalTime.sec > 0) totalTimeInString += `${totalTime.sec} s`;
	
	return totalTimeInString.trim();
}