/** 
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Cláudio Barradas, 2021
 * 
 */

 const game = {}; // encapsula a informação de jogo. Está vazio mas vai-se preenchendo com definições adicionais.

 const arrayTentativas = [];
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
	 scramble();
	 timer();
	 game.sounds.background.play();	
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
	 for(let i = 0; i<ROWS ; i++){ // Ciclo for para percorrer o array game.board[][], de forma a criar todas as cartas necessárias
		 for(let j = 0; j<COLS ; j++){
			 if(contador===maxContador){contador=0;} // Quando chegar a 24, que é a posição do último país, recomeça, de forma a criar 2 cartas para cada país
			 let umaCarta = document.createElement("div"); //Cria uma carta como div
			 umaCarta.classList.add("carta"); // Adiciona a carta à classe "carta"
			 umaCarta.style.backgroundPositionX = faces[contador].x; // Vai buscar a face da carta ao array faces[] para o x
			 umaCarta.style.backgroundPositionY = faces[contador].y; // Vai buscar a face da carta ao array faces[] para o y
			 umaCarta.style.left = CARDSIZE * j + "px"; // Define a posição da carta no ecrã
			 umaCarta.style.top = CARDSIZE * i + "px"; //
			 umaCarta.classList.add("escondida"); // Esconde a carta, adicionando-a à classe "escondida"
			 game.stage.appendChild(umaCarta); // Adiciona um filho ao game.stage
			 game.board[i][j] = umaCarta; //Define a carta no array game.board[][]
			 umaCarta.addEventListener("click",()=>{ // Adiciona o evento "click" a cada carta
				 if(arrayTentativas.length >= 2 ) return;
				 if(!umaCarta.classList.contains("escondida")) return;
				 umaCarta.classList.remove("escondida");
				 arrayTentativas.push(umaCarta);
				 if(arrayTentativas[1]){
					 if(!(arrayTentativas[0].style.backgroundPositionX === arrayTentativas[1].style.backgroundPositionX) || !(arrayTentativas[0].style.backgroundPositionY===arrayTentativas[1].style.backgroundPositionY)){
						 setTimeout(()=>{
							 arrayTentativas[0].classList.add("escondida");
							 arrayTentativas[1].classList.add("escondida");
							 arrayTentativas.pop();
							 arrayTentativas.pop();
						 },500);
					 }else{
						 arrayTentativas.pop();
						 arrayTentativas.pop();
					 }
				 }
			 });
 
			 contador++; 
		 }
	 }
	 
 }
 
 // Adicionar as cartas do tabuleiro à stage
 function render() {
 
	 
 }
 
 // baralha as cartas no tabuleiro
 function scramble() {
	 let contador= 0;
	 let maxCount=5;
	 let scrambleT = setInterval(() => {
		 for(let i = 0; i<ROWS ; i++){ // Vai percorrer o array para baralhar todas as cartas
			 for(let j = 0; j < COLS ; j++){
				 let posLeft = Math.floor(Math.random()*8); // Gera duas coordenadas random para a nova posição da carta
				 let posTop = Math.floor(Math.random()*6);
				 let umaCarta = game.board[i][j]; // Vai buscar a carta da origem
				 let carta = game.board[posTop][posLeft]; // Vai buscar a carta da posição para onde a carta original vai
				 umaCarta.classList.remove("escondida"); // Remove a classe escondida, ou seja, mostra a carta virada
				 carta.classList.remove("escondida");
				 umaCarta.style.left = CARDSIZE * posLeft + "px"; // Define a nova posição no ecrã
				 umaCarta.style.top = CARDSIZE * posTop + "px";
				 carta.style.left = CARDSIZE * j + "px";
				 carta.style.top = CARDSIZE * i + "px";
				 game.board[i][j] = carta; // Troca as cartas no array game.board[][]
				 game.board[posTop][posLeft] = umaCarta; //
				 setTimeout(()=>{
					 umaCarta.classList.add("escondida"); // Vai novamente esconder as cartas
					 carta.classList.add("escondida");
				 },2000); 
			 }
		 }
		 if(contador === maxCount){
			 clearInterval(scrambleT); //Quando o contador atingir o maxCount definido, acaba o setInterval()
		 }
		 contador++;
	 },500);	
 }
 
 function timer() {
	 setTimeout(function(){	
		 let contador = 0; 
		 let maxCount = 60; // Definimos o tempo máximo para 60 segundos
		 window.addEventListener("keydown",e =>{ // Quando a tecla "r" é pressionada, o tempo dá reset e é chamada a função scramble()
			 if(e.key === "r"){
				 scramble();
				 clearInterval(timeHandler);
				 timer();
			 }
		 })
		 let timeHandler = setInterval(() => {
			 contador++;
			 document.getElementById("time").value = contador;
			 if (contador === maxCount - 10) document.getElementById("time").classList.add("warning"); // Assim que faltar 10 segundos para o final, dá display a um warning na barra do temporizador
			 if (contador === maxCount) {															// avisando o utilizador de que o tempo está a acabar, e que o jogo vai ser baralhado.
				 scramble();
				 contador=0;
				 document.getElementById("time").classList.remove("warning"); // Remove o warning.
			 }
		 }, 1000)
	 },2000);
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