/** 
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Cláudio Barradas, 2021
 * 
 */

const game = {
	arrayTentativas: [], // Array que guarda as tentativas do utilizador, ou seja, garante que apenas duas cartas são viradas de cada vez
	arrayViradas: [], // Array que guarda as cartas encontradas
	virada: false, // Se uma carta fizer parte do arrayViradas, virada é true
	contadorTempo : 0, // Contador para o tempo
	maxTempo : 60, // Maximo de tempo definido para o jogo
	timeHandler : 0 //Handler do tempo
}; // encapsula a informação de jogo. Está vazio mas vai-se preenchendo com definições adicionais.

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
	document.getElementById("overlay").style.display = "none"; // Esconde o overlay
	setupAudio(); 		// configurar o audio
	getFaces(); 		// calcular as faces e guardar no array faces
	createCountries();	// criar países
	scramble();			// Baralha as cartas
	timer();			// Dá start ao temporizador
	render();			// render das cartas
	game.sounds.background.play(); // Dá play à música
	gameFunctions(); // Função responsável pela maior parte das funções do jogo
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
	let contador = 0; // É utilizado para garantir que são criadas 2 cartas de cada país
	let maxContador = 24; // Define o número de países
	for (let i = 0; i < ROWS; i++) { // Ciclo for para percorrer o array game.board[][], de forma a criar todas as cartas necessárias
		for (let j = 0; j < COLS; j++) {
			if (contador === maxContador) { contador = 0; } // Quando chegar a 24, que é a posição do último país, recomeça, de forma a criar 2 cartas para cada país
			let umaCarta = document.createElement("div"); //Cria uma carta como div
			umaCarta.classList.add("carta"); // Adiciona a carta à classe "carta"
			umaCarta.style.backgroundPositionX = faces[contador].x; // Vai buscar a face da carta ao array faces[] para o x
			umaCarta.style.backgroundPositionY = faces[contador].y; // Vai buscar a face da carta ao array faces[] para o y
			umaCarta.style.left = CARDSIZE * j + "px"; // Define a posição da carta no ecrã
			umaCarta.style.top = CARDSIZE * i + "px"; //
			umaCarta.classList.add("escondida"); // Esconde a carta, adicionando-a à classe "escondida"
			game.board[i][j] = umaCarta; //Define a carta no array game.board[][]
			umaCarta.addEventListener("mousedown", flipCard); // Adiciona o evento "click" a cada carta
			contador++; // Incrementa o contador
		}
	}

}

// Função responsável pelo fim do jogo
function endGame() {
	clearInterval(game.timeHandler); // Dá reset ao setInterval do tempo
	game.sounds.background.pause(); // Para a música
	game.contadorTempo = 0; // Dá reset ao contador do tempo
	document.getElementById("time").classList.remove("warning"); // Tira o warning do temporizador
	for (carta of game.arrayViradas) { // Vai percorrer o arrayViradas para remover os eventos das cartas
		carta.removeEventListener("mousedown", flipCard); 
	}
	game.arrayViradas = []; // Limpa o array que guarda as cartas viradas
	window.removeEventListener("keydown", restart); // Remove o evento da tecla r
	document.getElementById("overlay").style.display = "block"; // Mostra o overlay de fim de jogo
	document.getElementById("reiniciar").addEventListener("click",init); // Atribui um evento de reiniciar o jogo ao butão reiniciar
}

//Função responsável por virar a carta pressionada
function flipCard(e) {
	let umaCarta = e.target; 
	if (game.arrayTentativas.length >= 2) return; //Verificações, neste caso se o arrayTentativas não tiver 2 cartas guardadas no mesmo, da return
	if (!umaCarta.classList.contains("escondida")) return; // Se a carta já tiver sido escolhida, da return
	umaCarta.classList.remove("escondida"); 
	game.arrayTentativas.push(umaCarta); // Adiciona a carta ao arrayTentativas
	if (game.arrayTentativas[1]) { //Se o arrayTentativas tiver 2 cartas, então vai verificar se ambas as cartas dentro do array são iguais
		if (!(game.arrayTentativas[0].style.backgroundPositionX === game.arrayTentativas[1].style.backgroundPositionX) || !(game.arrayTentativas[0].style.backgroundPositionY === game.arrayTentativas[1].style.backgroundPositionY)) {
			setTimeout(() => {
				game.arrayTentativas[0].classList.add("escondida"); //Se as cartas forem diferentes, vai escondê-las
				game.arrayTentativas[1].classList.add("escondida");
				game.arrayTentativas.pop(); // vai removê-las do arrayTentativas
				game.arrayTentativas.pop();
			}, 500);
		} else {
			game.arrayViradas.push(game.arrayTentativas.pop()); //Se as cartas forem iguais, apenas remove-as do arrayTentativas
			game.arrayViradas.push(game.arrayTentativas.pop());
		}
	}
}

//Dá restart ao jogo, quando a tecla "r" é pressionada
function restart(e){
	if (e.key === "r") { //Verifica se a tecla pressionada é o "r"
		game.arrayViradas = []; //Limpa o arrayViradas
		game.contadorTempo = 0; // Dá reset ao contador do temporizador
		scramble();
		clearInterval(game.timeHandler); // Limpa o temporizador
		timer();
		gameFunctions();
	}
}

//Array das funções principais do jogo
function gameFunctions(){		
	var gameFuncInterval = setInterval(()=>{
		if(game.arrayViradas.length === 48){
			clearInterval(gameFuncInterval); //Limpa o setInterval 
			endGame(); //Chama a função endGame
		}
		window.addEventListener("keydown", restart // Adiciona um evento à window, responsável pelo restart do jogo
		)
	},5000)
	
}

// Adicionar as cartas do tabuleiro à stage
function render() {
	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLS; j++) {
			game.stage.appendChild(game.board[i][j]); //Vai percorrer o array game.board e vai adicionar todas as cartas à stage
		}
	}

}

//Esconde todas as cartas, excepto as cartas já encontradas
function flipAllCards() {
	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLS; j++) {
			let umaCarta = game.board[i][j];
			verificarCartasViradas(umaCarta); //Verifica se a carta em questão já foi encontrada
			if (!game.virada) { // Se a carta não tiver sido ainda encontrada, vai escondê-la
				umaCarta.classList.add("escondida"); 
			}
		}
	}
}
// baralha as cartas no tabuleiro
function scramble() {
	let contador = 0; // Contador para baralhar
	let maxCount = 5; // Número maximo de vezes que baralha
	let scramble = setInterval(() => {
		for (let i = 0; i < ROWS; i++) {
			for (let j = 0; j < COLS; j++) {
				game.virada = false; 
				let posL = Math.floor(Math.random() * 8); // Vai gerar uma nova posição random para o left 
				let posT = Math.floor(Math.random() * 6); // Vai gerar uma nova posição random para o top 
				let umaCarta = game.board[i][j]; // Define a carta atual 
				let novaCarta = game.board[posT][posL]; // Vai buscar a carta que está nas posições geradas
				if (!(game.arrayViradas.length === 0)) { // Verifica se o arrayViradas está vazio, de forma a decidir se as cartas vão ser todas baralhadas visivelmente ou 
					verificarCartasViradas(umaCarta, novaCarta); // se apenas são baralhadas as restantes, de forma escondida, uma vez que apenas no inicio do jogo as cartas devem ser mostradas,
					if (!game.virada) { // a serem baralhadas. Se a carta não tiver no arrayViradas vai ser baralhada
						// Define a nova posição no ecrã
						umaCarta.style.left = CARDSIZE * posL + "px"; 
						umaCarta.style.top = CARDSIZE * posT + "px";
						novaCarta.style.left = CARDSIZE * j + "px";
						novaCarta.style.top = CARDSIZE * i + "px";
						//troca as cartas
						game.board[i][j] = novaCarta;
						game.board[posT][posL] = umaCarta;
					}
				} else { // Vai baralhar todas as cartas
					//Vai mostrar as cartas
					umaCarta.classList.remove("escondida");
					novaCarta.classList.remove("escondida");
					// Define a nova posição no ecrã
					umaCarta.style.left = CARDSIZE * posL + "px"; 
					umaCarta.style.top = CARDSIZE * posT + "px";
					novaCarta.style.left = CARDSIZE * j + "px";
					novaCarta.style.top = CARDSIZE * i + "px";
					//troca as cartas
					game.board[i][j] = novaCarta;
					game.board[posT][posL] = umaCarta;
				}
			}
		}
		if (contador === maxCount) clearInterval(scramble); // quando o contador atingir o maximo, vai parar de baralhar
		contador++;
	}, 500)
	setTimeout(flipAllCards, 3300); // Esconde as cartas depois de serem baralhadas

}

//Vai fazer a verificação das cartas viradas, mudando o valor do game.virada para true se a carta já tiver sido encontrada
function verificarCartasViradas(umaCarta, novaCarta) {
	if (novaCarta) { // Verifica a existência do segundo atributo da função
		game.arrayViradas.forEach(carta => { //vai percorrer o arrayViradas e verificar carta a carta se já foi encontrada
			if ((carta.style.backgroundPositionX === umaCarta.style.backgroundPositionX && carta.style.backgroundPositionY === umaCarta.style.backgroundPositionY)
				|| carta.style.backgroundPositionX === novaCarta.style.backgroundPositionX && carta.style.backgroundPositionY === novaCarta.style.backgroundPositionY) game.virada = true;
		})
	} else {
		game.arrayViradas.forEach(carta => { //vai percorrer o arrayViradas e verificar carta a carta se já foi encontrada
			if ((carta.style.backgroundPositionX === umaCarta.style.backgroundPositionX && carta.style.backgroundPositionY === umaCarta.style.backgroundPositionY)) game.virada = true;
		})
	}

}

//Função do temporizador do jogo
function timer() { 
		setTimeout(()=>{
			game.timeHandler = setInterval(()=>{
				game.contadorTempo++; // Incrementa o contador do tempo
				document.getElementById("time").value = game.contadorTempo;
				if (game.contadorTempo === game.maxTempo - 5) document.getElementById("time").classList.add("warning"); // Assim que faltar 5 segundos para o final, dá display a um warning na barra do temporizador
				if (game.contadorTempo === game.maxTempo) {		// Se o contador atingir o valor máximo				// avisando o utilizador de que o tempo está a acabar, e que o jogo vai ser baralhado.
					scramble(); 
					game.contadorTempo = 0; // Reset ao contador
					document.getElementById("time").classList.remove("warning"); // Remove o warning.
				}
			},1000)
		},2200)
		
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