class RogueUtil {
	"use strict"; // Enforce strict mode for cleaner code and better error checking.
	
	static playerName;
	static playerScore;
	static playerNameSubmitted = false;
	
	// static variables:
	static gridLetters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"];
	static displayContainer = $("#display-container");
	static gameScreen = $("#game-screen");

	static tileNumberPerSmallGridRow = 10;
	static tileNumberPerLargeGridRow = 20;
	static playerPosition = ['f',9]; // Placeholder starting position.
	static currentPlayerLevel = 1;
	
	static playerInTraining = false;
	static playerInBattle = false;
	static playerCoins = 0;
	static playerMaxHealth = 20;
	static playerCurrentHealth = 20;
	static playerStrength = 5;
	static playerAgility = 5;
	static playerArmor = 5;
	
	// Enemies
	static currentEnemyHealth = 0;
	static enemyDefeated = true;
	static currentEnemyLocation;
	
//-----------------------------------------------------------------------------------------------------------------------//	
	// Launches MazeRogue
	static launchTitle(){
		RogueUtil.createSmallGrid();
		RogueUtil.createWelcomeScreen();
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Creates a grid with id 'grid', with rows(A-J) columns(0-9). Used by: (welcomeScreen(), toggleMainMenu()).
	static createSmallGrid() {
		// Remove any previous cell elements.
		RogueUtil.gameScreen.children().remove();
		
		let largeGridContainer = $('<div class="d-flex flex-wrap justify-content-center align-items-center" id="game-screen-grid"></div>'); // Document fragment to lower performance usage.
		
		// Resizing gameboard.
		RogueUtil.gameScreen.css("height","72.4%");
		RogueUtil.gameScreen.css("top","6.8%");

		// Loop that creates the grid elements.
		for (let i=0; i<RogueUtil.tileNumberPerSmallGridRow; i++){
			for (let j=0; j<RogueUtil.tileNumberPerSmallGridRow; j++){
				let cellID = `${RogueUtil.gridLetters[i]}${j}`; // Create cell ID
				let cell = $(`<div class="d-flex justify-content-center align-items-center" id="${cellID}"></div>`); // Creating new cell element.
				largeGridContainer.append(cell); // Append cell to document fragment.
			}
		}
		
		RogueUtil.gameScreen.append(largeGridContainer); // Appending grid to doc fragment.
		
		// Resizing squares.
		RogueUtil.gameScreen.children().children().css("height","10%");
		RogueUtil.gameScreen.children().children().css("width", "10%");
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Creates the game launch title screen.
	static createWelcomeScreen() {
		let welcomePos = ["#a0","#a1","#a2","#a3","#a4","#a5","#a6", // Grid positions.
						  "#b7","#b8",
						  "#c0","#c1","#c2","#c3","#d4","#d5","#d6","#d7","#d8"];
		let welcomeLetters= "WELCOMETOMAZEROGUE"; // Letters for welcome message.
		
		// Loop that creates the letter elements to append.
		for (let i=0; i<welcomePos.length; i++){
			let selectedDiv = $(`${welcomePos[i]}`);
			let createdDiv = $(`<b><div class="welcome-screen d-flex justify-content-center align-items-center text-danger container-fluid" style="display: none;">${welcomeLetters.charAt(i)}</div></b>`);
			
			// Appends letter to specified position.
			selectedDiv.append(createdDiv);
		}
		
		// Creating an animation for welcome screen.
		let welcomeTitle = $(".welcome-screen");
		welcomeTitle.fadeIn(1000);
		welcomeTitle.fadeOut(1000, function() {RogueUtil.gameScreen.children().children().children().remove(); RogueUtil.createMainMenu();}); // Removes the create div elements after the animation is finished, then calls the toggleMainMenu function.
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Creates the main menu.
	static createMainMenu(){
		let menuPos = ["#a0","#a1","#a2","#a3","#a5","#a6","#a7","#a8","#a9", // Grid positions.
					   "#b0","#b1","#b2","#b3","#b4","#b5","#b6","#b7","#b8","#b9",
					   "#e0","#e1","#e2","#e4","#e5","#e6","#e7",
		               "#f0","#f1","#f2","#f3","#f4","#f5","#f6","#f7",
					   "#g0","#g1","#g2","#g3","#g4","#g5","#g6","#g7","#g8","#g9",
					   "#h0","#h1","#h2","#h3","#h4","#h5","#h6"]; 
		let menuLetters= "MAZEROGUE----------NEWGAMETUTORIALHIGHSCORESCREDITS"; // Letters for welcome message.
		
		// Loop that creates the letter elements to append.
		for (let i=0; i<menuPos.length; i++){
			let selectedDiv = $(`${menuPos[i]}`);
			let createdDiv;
			
			if (i > 18 && i < 26){
				selectedDiv.addClass("new-game");
				createdDiv = $(`<b><div class="new-game d-flex justify-content-center align-items-center container-fluid" style="color: green; display: none;">${menuLetters.charAt(i)}</div></b>`);
				selectedDiv.append(createdDiv);
			}
			else if (i >= 26 && i < 34){
				selectedDiv.addClass("tutorial");
				createdDiv = $(`<b><div class="tutorial d-flex justify-content-center align-items-center container-fluid" style="color: green; display: none;">${menuLetters.charAt(i)}</div></b>`);
				selectedDiv.append(createdDiv);
			}
			else if (i >= 34 && i < 44){
				selectedDiv.addClass("highscores");
				createdDiv = $(`<b><div class="highscores d-flex justify-content-center align-items-center container-fluid" style="color: green; display: none;">${menuLetters.charAt(i)}</div></b>`);
				selectedDiv.append(createdDiv);
			}
			else if (i >= 44 && i < 51){
				selectedDiv.addClass("credits");
				createdDiv = $(`<b><div class="credits d-flex justify-content-center align-items-center container-fluid" style="color: green; display: none;">${menuLetters.charAt(i)}</div></b>`);
				selectedDiv.append(createdDiv);
			}
			else {
				createdDiv = $(`<b><div class="main-menu d-flex justify-content-center align-items-center container-fluid" style="color:blue; display: none;">${menuLetters.charAt(i)}</div></b>`);	
			}
			
			// Appends letter to specified position.
			selectedDiv.append(createdDiv);
		}
		
		// Creating an animation for menu (maybe).
		let menuTitle = $(".main-menu");

		// Highlighting menu options.
		let newGameClassSelector = $(".new-game");
		let tutorialClassSelector = $(".tutorial");
		let highscoreClassSelector = $(".highscores");
		let creditClassSelector = $(".credits");
		newGameClassSelector.hover(function(){newGameClassSelector.css("background-color","white"); newGameClassSelector.children().css("background-color","white");}, function(){newGameClassSelector.css("background-color", "black"); newGameClassSelector.children().css("background-color","black");});
		newGameClassSelector.on("click", function() {newGameClassSelector.css("color", "red");});
		tutorialClassSelector.hover(function(){tutorialClassSelector.css("background-color","white"); tutorialClassSelector.children().css("background-color","white");}, function(){tutorialClassSelector.css("background-color", "black"); tutorialClassSelector.children().css("background-color","black");});
		tutorialClassSelector.on("click", function() {tutorialClassSelector.css("color", "red");});
		highscoreClassSelector.hover(function(){highscoreClassSelector.css("background-color","white"); highscoreClassSelector.children().css("background-color","white");}, function(){highscoreClassSelector.css("background-color", "black"); highscoreClassSelector.children().css("background-color","black");});
		highscoreClassSelector.on("click", function() {highscoreClassSelector.css("color", "red");});
		creditClassSelector.hover(function(){creditClassSelector.css("background-color","white"); creditClassSelector.children().css("background-color","white");}, function(){creditClassSelector.css("background-color", "black"); creditClassSelector.children().css("background-color","black");});
		creditClassSelector.on("click", function() {creditClassSelector.css("color", "red");});
		
		// Button functionality.
		// New Game.
		newGameClassSelector.on("click", RogueUtil.newGame); // Function reference for click event. If it was a call it would have () after.
		// Tutorial.
		tutorialClassSelector.on("click", RogueUtil.drawTutorial); // Function reference for click event. If it was a call it would have () after.
		// Highscore.
		highscoreClassSelector.on("click", RogueUtil.drawHighscores); // Function reference for click event. If it was a call it would have () after.
		// Credits.
		creditClassSelector.on("click", RogueUtil.drawCredits); // Function reference for click event. If it was a call it would have () after.
	}
//-----------------------------------------------------------------------------------------------------------------------//	
	// Draws the tutorial page.
	static drawTutorial(){
		// Remove any previous cell elements.
		RogueUtil.gameScreen.children().remove();
		
		let tutorialPage = `<div class="d-flex flex-column align-items-center tutorial-page" style="color: white;">
		<h4 style="color: orange;">Controls</h4><p><b>The arrow keys</b> move the character around the gameboard.<br>E and F are used in order to interact with different objects in the environment.
		<h4 style="color: orange;">Combat and attributes</h4>
		<p><b>At the end</b> of each level, you will have the option to upgrade attributes by spending coins.<br>
		<b style="color: red;">Strength</b>, increases the amount of damage you do.<br>
		<b style="color: red;">Agility</b>, increases your chance of escaping an enemy.<br>
		<b style="color: red;">Health</b>, increases in this skill, will increase your maximum health reserve.<br>
		<b style="color: red;">Armor</b>, adds a percentage damage reduction to enemies.<br>
		<b>In order to</b> exit the training menu, you must spend all of your coins, and then attempt to train a skill that is too expensive.<br>
		<b>Enemies</b> get more difficult with each new level, so be sure to train as much as possible.</p>
		<button style="color: black; background-color: white;" id="return">Back</button></div>`;
		
		RogueUtil.gameScreen.append(tutorialPage);
		$('#return').on("click", function() {RogueUtil.gameScreen.children().remove(); RogueUtil.launchTitle();});
	}
//-----------------------------------------------------------------------------------------------------------------------//	
	// Draws the highscore page.
	static drawHighscores(){
		/* BROKEN FOR NOW REQUIRES WEB SERVER.
		// Remove any previous cell elements.
		RogueUtil.gameScreen.children().remove();
		
		// Function to retrieve high scores with names
		function getHighScores() {
		// Fetching JSON data from a local file or server
		fetch('includes/script.json')
		  .then(response => {
			if (!response.ok) {
			  throw new Error('Network response was not ok');
			}
			return response.json();
		  })
		  .then(data => {
			let highscorePage = $(`<div class="d-flex flex-column align-items-center highscore-page" style="color: white;">${data.name}${data.score}<button style="color: black; background-color: white;" id="return">Back</button></div>`);
			RogueUtil.gameScreen.append(highscorePage);
			$('#return').on("click", function() {RogueUtil.gameScreen.children().remove(); RogueUtil.launchTitle();});
		  })
		  .catch(error => {
			console.error('Error fetching data:', error);
		  });
		}

		getHighScores();
		*/
	}
//-----------------------------------------------------------------------------------------------------------------------//	
	// Draws the credits page.
	static drawCredits(){
		// Remove any previous cell elements.
		RogueUtil.gameScreen.children().remove();

		let creditPage = `<div class="d-flex flex-column align-items-center tutorial-page" style="color: white;">
		<h4 style="color: orange;">Credits</h4><p><br><b>Hamzalopode</b>
		provided all of the sprite images in this project: dungeon-crawler-tileset from: https://opengameart.org/content/dungeon-crawler-tileset</p>
		<p><br><b>Camosun College</b>
		provided my education and experience in order to create this project!</p>
		<p><br><b>Christian Griffin (Me)</b>
		Created all of the code in order to make this project function!</p>
		<button style="color: black; background-color: white;" id="return">Back</button></div>`;
		
		RogueUtil.gameScreen.append(creditPage);
		$('#return').on("click", function() {RogueUtil.gameScreen.children().remove(); RogueUtil.launchTitle();});
	}
//-----------------------------------------------------------------------------------------------------------------------//	
	// Starts a new game.
	static newGame(){
		let transitionTimer = 1000;
		
		// Removing main menu elements, with animation.
		RogueUtil.displayContainer.find("img").fadeOut(transitionTimer, function(){RogueUtil.displayContainer.find("#computer-img").hide();}); // Hide computer image.
		RogueUtil.gameScreen.fadeOut(transitionTimer, function(){RogueUtil.gameScreen.fadeIn(transitionTimer); RogueUtil.createLargeGrid(); GameLogic.startGame(); if (!RogueUtil.playerNameSubmitted){GameLogic.getPlayerName();}}); // Calling functions to create the gameworld, and animate the transition.
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Creates a grid with id 'grid', with rows(A-J) columns(0-9). Used by: (newGame()).
	static createLargeGrid() {
		// Remove any previous cell elements.
		RogueUtil.gameScreen.children().remove();
		
		let largeGridContainer = $('<div class="d-flex flex-wrap justify-content-center align-items-center" id="game-screen-grid"></div>'); // Document fragment to lower performance usage.
		
		// Resizing gameboard.
		RogueUtil.displayContainer.css("height", "100vh");
		RogueUtil.displayContainer.css("max-width", "100vw");
		RogueUtil.displayContainer.css("aspect-ratio", "1 / 1");
		
		// Loop that creates the grid elements.
		for (let i=0; i<RogueUtil.tileNumberPerLargeGridRow; i++){
			for (let j=0; j<RogueUtil.tileNumberPerLargeGridRow; j++){
				let cellID = `${RogueUtil.gridLetters[i]}${j}`; // Create cell ID
				let cell = $(`<div class="d-flex justify-content-center align-items-center" id="${cellID}"></div>`); // Creating new cell element.
				largeGridContainer.append(cell); // Append cell to document fragment.
			}
		}
		
		RogueUtil.gameScreen.append(largeGridContainer); // Appending grid to doc fragment.
		
		// Resizing gameboard.
		RogueUtil.gameScreen.css("height","100%");
		RogueUtil.gameScreen.css("top","0");
		
		// Resizing squares.
		RogueUtil.gameScreen.children().children().css("height","5%");
		RogueUtil.gameScreen.children().children().css("width", "5%");
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Controls user input. Used by: (newGame()).
	static userInput() {
		
		$(document).keydown(function() {
			if (RogueUtil.playerNameSubmitted){
				if (!RogueUtil.playerInBattle && !RogueUtil.playerInTraining && RogueUtil.enemyDefeated){
					if (event.which === 38) { // Up arrow key.
						for (let i=0; i<RogueUtil.gridLetters.length; i++){
							if (RogueUtil.gridLetters[i] == RogueUtil.playerPosition[0] && $(`#${RogueUtil.gridLetters[i - 1]}${RogueUtil.playerPosition[1]}`).find('.ground').length){ // Checking if above cell is ground.
								RogueUtil.playerPosition[0] = RogueUtil.gridLetters[i-1];
								GameLogic.playerGraphics(); // Update playerGraphics everytime the player moves.
								GameLogic.environmentGraphics();
								GameLogic.enemySearch();
								break;
							}
						}
					}
					if (event.which === 40) { // Down arrow key.
						for (let i=0; i<RogueUtil.gridLetters.length; i++){
							if (RogueUtil.gridLetters[i] == RogueUtil.playerPosition[0] && $(`#${RogueUtil.gridLetters[i + 1]}${RogueUtil.playerPosition[1]}`).find('.ground').length){
								RogueUtil.playerPosition[0] = RogueUtil.gridLetters[i+1];
								GameLogic.playerGraphics();
								GameLogic.environmentGraphics();
								GameLogic.enemySearch();
								break;
							}
						}				
					}
					if (event.which === 37 && $(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1] - 1}`).find('.ground').length) { // Left arrow key.
						RogueUtil.playerPosition[1]-=1;
						GameLogic.playerGraphics();
						GameLogic.environmentGraphics();
						GameLogic.enemySearch();
					}
					if (event.which === 39 && $(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1] + 1}`).find('.ground').length) { // Right arrow key.
						RogueUtil.playerPosition[1]+=1;
						GameLogic.playerGraphics();
						GameLogic.environmentGraphics();
						GameLogic.enemySearch();
					}
					
					// Object interactions.
					// Exit.
					if (event.which === 70 && $('.exit-message').length) { // 'F' key.
						$('.exit-message').remove();
						// Increment currentPlayerLevel when proceeding to another level.
						RogueUtil.currentPlayerLevel++;
						RogueUtil.newGame();
					}
					if (event.which === 69 && $('.exit-message').length) { // 'E' key.
						RogueUtil.playerInTraining = true;
						GameLogic.trainingLogic();
					}
					
					// Chest.
					if (event.which === 70 && $('.chest-message').length) { // 'F' key.
						GameLogic.coinFunctionality();
					}				
				}
				
				if (RogueUtil.playerInBattle && !RogueUtil.playerInTraining && !RogueUtil.enemyDefeated){
					// Enemy
					if (event.which === 70) { // 'F' key.
						GameLogic.commenceBattle();
					}
					if (event.which === 69) { // 'E' key.
						GameLogic.commenceEscape();
					}
				}
			}
		});
	}
}