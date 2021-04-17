/** 
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Cláudio Barradas, 2021
 * 
 */

const game = {}; // encapsula a informação de jogo. Está vazio mas vai-se preenchendo com definições adicionais.

// sons do jogo
const sounds = {
	background: null,
	flip: null,
	success: null,
	hide: null
};

// numero de linhas e colunas do tabuleiro;
const ROWS = 6;
const COLS = 8;

game.sounds = sounds; // Adicionar os sons sons do jogo ao objeto game.
game.board = Array(COLS).fill().map(() => Array(ROWS)); // criação do tabuleiro como um array de 6 linhas x 8 colunas

// Representa a imagem de uma carta de um país. Esta definição é apenas um modelo para outros objectos que sejam criados
// com esta base através de let umaFace = Object.create(face).
const face = {
	country: -1,
	x: -1,
	y: -1
};

const CARDSIZE = 100; 	// tamanho da carta (altura e largura)
let faces = []; 		// Array que armazena objectos face que contêm posicionamentos da imagem e códigos dos paises


window.addEventListener("load", init, false);

function init() {
	game.stage = document.querySelector("#stage");
	setupAudio(); 		// configurar o audio
	getFaces(); 		// calcular as faces e guardar no array faces
	createCountries();	// criar países
	//scramble();
	game.sounds.background.play();
	timer();
	//completar
}

// Cria os paises e coloca-os no tabuleiro de jogo(array board[][])
function createCountries() {
	/* DICA:
	Seja umaCarta um elemento DIV, a imagem de carta pode ser obtida nos objetos armazenados no array faces[]; o verso da capa 
	está armazenado na ultima posicao do array faces[]. Pode também ser obtido através do seletor de classe .escondida do CSS.
		umaCarta.classList.add("carta"); 	
		umaCarta.style.backgroundPositionX=faces[0].x;
		umaCarta.style.backgroundPositionX=faces[0].y;

		Colocar uma carta escondida:
			umaCarta.classList.add("escondida");
			
		virar a carta:
			umaCarta.classList.remove("escondida");
	*/
	let contador = 0;
	let maxContador = 24; 
	for(let i = 0; i<ROWS ; i++){
		for(let j = 0; j<COLS ; j++){
			if(contador===maxContador){contador=0;}
			let umaCarta = document.createElement("div");
			umaCarta.classList.add("carta");
			umaCarta.style.backgroundPositionX = faces[contador].x;
			umaCarta.style.backgroundPositionY = faces[contador].y;
			umaCarta.style.left = CARDSIZE * j + "px";
			umaCarta.style.top = CARDSIZE * i + "px";
			//umaCarta.classList.add("escondida");
			game.stage.appendChild(umaCarta);
			game.board[i][j] = umaCarta;
			contador++;
		}
	}
	
	
	//game.stage[0][0]= umaCarta;
	
}

// Adicionar as cartas do tabuleiro à stage
function render() {

	
}

// baralha as cartas no tabuleiro
function scramble() {
	
	let contador= 0;
	let maxCount=60;
	
	let timeHandler = setInterval(() => {
		contador++;
		umaCarta.style.left = (CARDSIZE * Math.floor(Math.random()*8)) + "px";
		umaCarta.style.top = (CARDSIZE * Math.floor(Math.random()*6)) + "px";
		if(contador=== maxCount){
			clearInterval(timeHandler);
		}
	},500)
}

function timer() {
	
	let contador = 0;
	let maxCount = 60;
	let timeHandler = setInterval(() => {
		contador++;
		document.getElementById("time").value = contador;
		if (contador === maxCount - 10) document.getElementById("time").classList.add("warning");
		if (contador === maxCount) {
			clearInterval(timeHandler);
			document.getElementById("time").classList.remove("warning");
		}
	}, 1000)
}




/* ------------------------------------------------------------------------------------------------  
 ** /!\ NÃO MODIFICAR ESTAS FUNÇÕES /!\
-------------------------------------------------------------------------------------------------- */

// configuração do audio
function setupAudio() {
	game.sounds.background = document.querySelector("#backgroundSnd");
	game.sounds.success = document.querySelector("#successSnd");
	game.sounds.flip = document.querySelector("#flipSnd");
	game.sounds.hide = document.querySelector("#hideSnd");
	game.sounds.win = document.querySelector("#goalSnd");

	// definições de volume;
	game.sounds.background.volume = 0.05;  // o volume varia entre 0 e 1

	// nesta pode-se mexer se for necessário acrescentar ou configurar mais sons

}

// calcula as coordenadas das imagens da selecao de cada país e atribui um código único
function getFaces() {
	/* NÂO MOFIFICAR ESTA FUNCAO */
	let offsetX = 1;
	let offsetY = 1;
	for (let i = 0; i < 5; i++) {
		offsetX = 1;
		for (let j = 0; j < 5; j++) {
			let countryFace = Object.create(face); 				// criar um objeto com base no objeto face
			countryFace.x = -(j * CARDSIZE + offsetX) + "px";   // calculo da coordenada x na imagem
			countryFace.y = -(i * CARDSIZE + offsetY) + "px";   // calculo da coordenada y na imagem
			countryFace.country = "" + i + "" + j; 			    // criação do código do país
			faces.push(countryFace); 					        // guardar o objeto no array de faces
			offsetX += 2;
		}
		offsetY += 2;
	}
}

/* ------------------------------------------------------------------------------------------------
 ** /!\ NÃO MODIFICAR ESTAS FUNÇÕES /!\
-------------------------------------------------------------------------------------------------- */