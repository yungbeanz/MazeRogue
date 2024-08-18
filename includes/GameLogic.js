class GameLogic {
	"use strict"; // Enforce strict mode for cleaner code and better error checking.
	
	// Static variables.
	static previousPlayerLocation = null;
	
//-----------------------------------------------------------------------------------------------------------------------//	
	// Starts the new game.
	static startGame(){
		// Initialize Gui.
		GameLogic.initializeGui();
	
		// FOR GROUND TILES.
		let tileImages = ['includes/sprites/stairs1.png', 'includes/sprites/stairs2.png', 
						  'includes/sprites/brick1.png', 'includes/sprites/brick2.png', 
						  'includes/sprites/brick3.png', 'includes/sprites/brick4.png', 
						  'includes/sprites/brick5.png', 'includes/sprites/brick6.png', 
						  'includes/sprites/sand1.png', 'includes/sprites/sand2.png', 
						  'includes/sprites/sand3.png', 'includes/sprites/sand4.png', 
						  'includes/sprites/sand5.png', 'includes/sprites/stairs1.png',
						  'includes/sprites/stairs2.png'];
		
		// Spawn constraint variables.
		let exitMade = false;
		let entranceMade = false;
		let floorToStairsMade = false;
		let lastFloorPosition = 0;
		// Variable to indicate random position the floor should start at.
		let randomFloorNum = Math.floor(Math.random() * RogueUtil.tileNumberPerLargeGridRow);
		
		// Loop that iterates through the grid elements.
		for (let i=0; i<RogueUtil.tileNumberPerLargeGridRow; i++){

			// Tracks floor size per row.
			let currentFloorSize = 0;
			// Variable to generate random length of the floor per row.
			let randomFloorLength = Math.floor(Math.random() * RogueUtil.tileNumberPerLargeGridRow) + 2;

			for (let j=0; j<RogueUtil.tileNumberPerLargeGridRow; j++){

				// Finding current cell ID.
				let cellID = `${RogueUtil.gridLetters[i]}${j}`;
				// randomNumber variable used for multiple purposes.
				let randomNum = Math.floor(Math.random() * RogueUtil.tileNumberPerLargeGridRow);
				// Image element to append.
				let environmentImage;
				
				// Adding spawn constraints for stairs, floors. AND also implementing Procedural Generation. Based off random numbers.
				switch (true){
					case (!entranceMade && i < 2 && currentFloorSize > 0 && currentFloorSize < randomFloorLength):
						randomNum = 13;
						environmentImage = $(`<img src='${tileImages[randomNum]}' class='ground entrance img-fluid'>`);
						entranceMade = true;
						RogueUtil.playerPosition[0] = RogueUtil.gridLetters[i]; // Set the playerPosition, so that the player spawns on the entrance when the level is created.
						RogueUtil.playerPosition[1] = j;
						currentFloorSize++;
						break;
					case (!exitMade && i > RogueUtil.tileNumberPerLargeGridRow - Math.floor((Math.random() * 5) + 1) && currentFloorSize > 0 && currentFloorSize < randomFloorLength):
						randomNum = 14;
						environmentImage = $(`<img src='${tileImages[randomNum]}' class='ground exit img-fluid'>`);
						exitMade = true;
						currentFloorSize++;
						break;
					case (j == randomFloorNum || currentFloorSize >= 1 && currentFloorSize < randomFloorLength || lastFloorPosition == `${RogueUtil.gridLetters[i-1]}${j + randomFloorLength}` || lastFloorPosition == `${RogueUtil.gridLetters[i-1]}${j - randomFloorLength}`):
						randomNum = Math.floor((Math.random() * 5) + 8);
						environmentImage = $(`<img src='${tileImages[randomNum]}' class='ground img-fluid'>`);
						lastFloorPosition = cellID;
						currentFloorSize++;
						break;
					default:
						randomNum = Math.floor((Math.random() * 6) + 2);
						environmentImage = $(`<img src='${tileImages[randomNum]}' class='wall img-fluid'>`);
				}
				
				// Appending image.
				$("#" + cellID).append(environmentImage);
			}
		}
		
		
		// FOR OBJECT TILES.
		let objectImages = ['includes/sprites/enemy1.png', 'includes/sprites/chest1.png'];
		
		// Storing previous enemy location. Must be out here.
		let lastEnemyLocation = 0;
				
		// Loop that iterates through the grid elements.
		for (let i=0; i<RogueUtil.tileNumberPerLargeGridRow; i++){
			
			// Variable to keep track of number of objects.
			let objectAmount = 0;

			for (let j=0; j<RogueUtil.tileNumberPerLargeGridRow; j++){

				// Finding current cell ID.
				let cellID = `${RogueUtil.gridLetters[i]}${j}`;
				// randomNumber variable used for determining if an object should spawn.
				let shouldObjectSpawn = Math.floor(Math.random() * 100);
				// randomNumber variable used for determining which object to spawn.
				let randomNum = Math.floor(Math.random() * objectImages.length);
				// Image element to append.
				let objectImage;
				

				if ($("#" + cellID).find('.ground').length && !$("#" + cellID).find('.entrance').length && !$("#" + cellID).find('.exit').length && shouldObjectSpawn > 95 && objectAmount < 2){ // Conditions for spawning an object.
					if (randomNum == 1){
						objectImage = $(`<img src='${objectImages[randomNum]}' class='chest img-fluid' style='background-color: transparent; position: absolute;'>`);
						objectAmount++;
					}
					else if (randomNum == 0 && i < lastEnemyLocation - 3 || randomNum == 0 && i > lastEnemyLocation + 3 || randomNum == 0 && lastEnemyLocation == 0){
						objectImage = $(`<img src='${objectImages[randomNum]}' class='enemy img-fluid' style='background-color: transparent; position: absolute;'>`);
						objectAmount++;
						lastEnemyLocation = i;
					}
				}
				
				// Appending image.
				$("#" + cellID).append(objectImage);
			}
		}
		
		
		// Initialize player lighting, and player image.
		GameLogic.playerGraphics();
		// Initialize environment graphics.
		GameLogic.environmentGraphics();
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Function that creates the player lighting, also draws the player.
	static playerGraphics() {

		// Apply darkness to entire level.
		for (let i=0; i<RogueUtil.tileNumberPerLargeGridRow; i++){
			for (let j=0; j<RogueUtil.tileNumberPerLargeGridRow; j++){
				let cellID = `${RogueUtil.gridLetters[i]}${j}`;
				// Appending image.
				if (cellID != RogueUtil.playerPosition[0] + RogueUtil.playerPosition[1]){			
					$("#" + cellID).children().css("opacity","0");
				}
			}
		}
		
		// Player lightsource creation.
		for (let i=0; i<RogueUtil.tileNumberPerLargeGridRow; i++){
			for (let j=0; j<RogueUtil.tileNumberPerLargeGridRow; j++){
				
				let cellID = `${RogueUtil.gridLetters[i]}${j}`;
				// Appending image.
				if (cellID == RogueUtil.playerPosition[0] + RogueUtil.playerPosition[1]){
					$("#" + cellID).children().css("opacity","1");
					
					cellID = `${RogueUtil.gridLetters[i-1]}${j}`;
					$("#" + cellID).children().css("opacity","0.7");
					cellID = `${RogueUtil.gridLetters[i+1]}${j}`;
					$("#" + cellID).children().css("opacity","0.7");
					cellID = `${RogueUtil.gridLetters[i]}${j-1}`;
					$("#" + cellID).children().css("opacity","0.7");
					cellID = `${RogueUtil.gridLetters[i]}${j+1}`;
					$("#" + cellID).children().css("opacity","0.7");
					
					cellID = `${RogueUtil.gridLetters[i-1]}${j-1}`;
					$("#" + cellID).children().css("opacity","0.5");
					cellID = `${RogueUtil.gridLetters[i+1]}${j+1}`;
					$("#" + cellID).children().css("opacity","0.5");
					cellID = `${RogueUtil.gridLetters[i+1]}${j-1}`;
					$("#" + cellID).children().css("opacity","0.5");
					cellID = `${RogueUtil.gridLetters[i-1]}${j+1}`;
					$("#" + cellID).children().css("opacity","0.5");
				}
			}
		}
		
		// Draw the players sprite.
		for (let i=0; i<RogueUtil.tileNumberPerLargeGridRow; i++){
			for (let j=0; j<RogueUtil.tileNumberPerLargeGridRow; j++){
				let cellID = `${RogueUtil.gridLetters[i]}${j}`;
				let playerImage = $(`<img src='includes/sprites/player.png' style='position: absolute; background-color: transparent' class='player img-fluid'>`);
				// Appending image.
				if (cellID == RogueUtil.playerPosition[0] + RogueUtil.playerPosition[1]){
				// Removing previous image.
					if (GameLogic.previousPlayerLocation != null){
						GameLogic.previousPlayerLocation.find('.player').remove();
					}
					$("#" + cellID).append(playerImage);
					GameLogic.previousPlayerLocation = $("#" + cellID);
					break;
				}
			}
		}
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Function that changes graphics for environmental objects.
	static environmentGraphics(){
		// Functionality for environment objects.
		let message;
		// Exit.
		message = $('<div class="d-flex exit-message text-center" style="z-index: 1; position: fixed; color: red; background-color: transparent; font-weight: bold;">F to exit, or E to train. (costs coins).</div>');
		$('.exit-message').remove(); // Remove old exit message.	
		if ($(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).find('.exit').length){
			$(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).append(message);
		}
		// Chest.
		message = $('<div class="d-flex chest-message text-center" style="z-index: 1; position: fixed; color: red; background-color: transparent; font-weight: bold;">F to open chest.</div>');
		$('.chest-message').remove(); // Remove old exit message.	
		if ($(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).find('.chest').length){
			$(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).append(message);
		}
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Function that controls logic for the battle screen.
	static commenceBattle() {
		if ($('.enemy-message').length){
			RogueUtil.currentEnemyHealth += Math.floor(((Math.random() * 10) + 10) + RogueUtil.currentPlayerLevel);
		}
		// Remove enemy prompt.
		$('.enemy-message').remove();
		
		console.log(RogueUtil.currentEnemyHealth);
		// Update enemy health.
		$('.enemy-health').remove();
		
		let playerDamage = Math.floor(((Math.random() * 2) + 2) * RogueUtil.playerStrength);
		let enemyDamage = Math.floor((((Math.random() * 1) + 2) * RogueUtil.currentPlayerLevel) - ((((Math.random() * 1) + 2) * RogueUtil.currentPlayerLevel) * (RogueUtil.playerArmor * 0.01)));
		
		RogueUtil.playerCurrentHealth -= enemyDamage;
		RogueUtil.currentEnemyHealth -= playerDamage;
		// Enemy Health displayed.
		let message = $(`<div class="d-flex enemy-health text-center" style="z-index: 1; position: fixed; color: pink; background-color: transparent; font-weight: bold;">F to attack, E to escape<br>Enemy Health: ${RogueUtil.currentEnemyHealth}</div>`);
		$(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).append(message);
		console.log(RogueUtil.currentEnemyHealth);	
		
		if (RogueUtil.currentEnemyHealth <= 0){
			let coinValue = Math.floor(Math.random() * 100);
			RogueUtil.playerCoins += coinValue; // coin reward for defeating enemy.
			RogueUtil.playerScore += coinValue;
			RogueUtil.enemyDefeated = true;
			RogueUtil.playerInBattle = false;
			RogueUtil.currentEnemyLocation.find('.enemy').remove();
			$('.enemy-health').remove();
			RogueUtil.currentEnemyHealth = 0;
			// Damage logic
		} else {
			RogueUtil.enemyDefeated = false;
			RogueUtil.playerInBattle = true;			
		}
		GameLogic.initializeGui();
		
		// GameOver
		if (RogueUtil.playerCurrentHealth <= 0){
			GameLogic.gameOver();
		}
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Function that controls logic for the battle screen.
	static commenceEscape() {
		let chanceToEscape = Math.floor((Math.random() * 100) + RogueUtil.playerAgility);
		
		if ($('.enemy-message').length){
			RogueUtil.currentEnemyHealth += Math.floor(((Math.random() * 10) + 10) + RogueUtil.currentPlayerLevel);
		}
		// Remove enemy prompt.
		$('.enemy-message').remove();
		
		// Update enemy health.
		$('.enemy-health').remove();
		
		let enemyDamage = Math.floor((((Math.random() * 1) + 2) * RogueUtil.currentPlayerLevel) - ((((Math.random() * 1) + 2) * RogueUtil.currentPlayerLevel) * (RogueUtil.playerArmor * 0.01)));

		// Enemy Health displayed.
		let message = $(`<div class="d-flex enemy-health text-center" style="z-index: 1; position: fixed; color: pink; background-color: transparent; font-weight: bold;">F to attack, E to escapeEnemy Health: ${RogueUtil.currentEnemyHealth}</div>`);
		$(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).append(message);
		console.log(RogueUtil.currentEnemyHealth);
		
		if (chanceToEscape < 75){
			RogueUtil.enemyDefeated = false;
			RogueUtil.playerInBattle = true;
			RogueUtil.playerCurrentHealth -= enemyDamage;
		} else if (chanceToEscape > 75){
			let coinValue = Math.floor(Math.random() * 100);
			RogueUtil.playerCoins += coinValue; // coin reward for evading enemy.
			RogueUtil.playerScore += coinValue;
			RogueUtil.enemyDefeated = true;
			RogueUtil.playerInBattle = false;
			RogueUtil.currentEnemyLocation.find('.enemy').remove();
			$('.enemy-health').remove();
			RogueUtil.currentEnemyHealth = 0;			
		}
		GameLogic.initializeGui();
		
		// GameOver
		if (RogueUtil.playerCurrentHealth <= 0){
			GameLogic.gameOver();
		}
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Function that controls logic for training.
	static gameOver() {
		// Function to save high scores with names
		
		/* BROKEN FOR NOW REQUIRES WEB SERVER.
		function saveHighScore(name, newScore) {
		  // Retrieve existing high scores from LocalStorage
		  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

		  // Add new score with name to the array
		  highScores.push({ name: name, score: newScore });

		  // Sort high scores in descending order based on the score
		  highScores.sort((a, b) => b.score - a.score);

		  // Keep only the top 10 scores (optional)
		  if (highScores.length > 10) {
			highScores = highScores.slice(0, 10);
		  }

		  // Save updated high scores back to LocalStorage
		  localStorage.setItem('highScores', JSON.stringify(highScores));
		}

		saveHighScore(`${RogueUtil.playerName}`, `${RogueUtil.playerScore}`);
		*/
		
		// Remove any previous cell elements.
		RogueUtil.gameScreen.children().remove();
		// Relaunch title screen.
		RogueUtil.launchTitle();
		
		// Reset global variables.
		$("#computer-img").hide();
		RogueUtil.playerNameSubmitted = false;
		RogueUtil.playerPosition = ['f',9]; // Placeholder starting position.
		RogueUtil.currentPlayerLevel = 1;
		RogueUtil.playerInTraining = false;
		RogueUtil.playerInBattle = false;
		RogueUtil.playerCoins = 0;
		RogueUtil.playerMaxHealth = 20;
		RogueUtil.playerCurrentHealth = 20;
		RogueUtil.playerStrength = 5;
		RogueUtil.playerAgility = 5;
		RogueUtil.playerArmor = 5;
		
		// Enemies
		RogueUtil.currentEnemyHealth = 0;
		RogueUtil.enemyDefeated = true;
		RogueUtil.currentEnemyLocation;
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Function that controls logic for training.
	static trainingLogic() {
		
		// Initialize GUI everytime trainingLogic is called.
		GameLogic.initializeGui();
		
		// Variable to hold the price of an upgrade.
		let upgradePrice;
		// Exit message must be removed because it plays a part in the logic for buttons that are pressed when it is displayed.
		$('.exit-message').remove();
		
		// Creating the upgrade buttons when player decides to train.
		let trainingHealthButton = $('<div style="font-weight: bold; background-color: grey;" class="trainingHealthButton">+</div>');
		trainingHealthButton.on("click", function(){healthUpgrade();});
		$('.health').append(trainingHealthButton);
		let trainingStrengthButton = $('<div style="font-weight: bold; background-color: grey;" class="trainingStrengthButton">+</div>');
		trainingStrengthButton.on("click", function(){strengthUpgrade();});
		$('.strength').append(trainingStrengthButton);
		let trainingAgilityButton = $('<div style="font-weight: bold; background-color: grey;" class="trainingAgilityButton">+</div>');
		trainingAgilityButton.on("click", function(){agilityUpgrade();});
		$('.agility').append(trainingAgilityButton);
		let trainingArmorButton = $('<div style="font-weight: bold; background-color: grey;" class="trainingArmorButton">+</div>');
		trainingArmorButton.on("click", function(){armorUpgrade();});
		$('.armor').append(trainingArmorButton);
		
		// Creating the prices for each stat upgrade.
		upgradePrice = RogueUtil.playerMaxHealth * 10;
		trainingHealthButton.append(`<div class="trainingHealthPrice" style=" color: white;">$${upgradePrice}</div>`);
		upgradePrice = RogueUtil.playerStrength * 25;
		trainingStrengthButton.append(`<div class="trainingStrengthPrice" style=" color: white;">$${upgradePrice}</div>`);
		upgradePrice = RogueUtil.playerAgility * 25;
		trainingAgilityButton.append(`<div class="trainingAgilityPrice" style=" color: white;">$${upgradePrice}</div>`);
		upgradePrice = RogueUtil.playerArmor * 25;
		trainingArmorButton.append(`<div class="trainingArmorPrice" style=" color: white;">$${upgradePrice}</div>`);
		
		// Functions that control the upgrade button logic.
		function healthUpgrade() {
			upgradePrice = RogueUtil.playerMaxHealth * 10;
			if (RogueUtil.playerCoins < upgradePrice){
				RogueUtil.playerInTraining = false;
			}
			if (!RogueUtil.playerInTraining){
				// Reset GUI once player is done training.
				GameLogic.initializeGui();			
			}
			if (RogueUtil.playerCoins > upgradePrice){
				$('.trainingHealthPrice').remove();
				RogueUtil.playerCoins-=upgradePrice;
				RogueUtil.playerMaxHealth +=5;
				RogueUtil.playerCurrentHealth = RogueUtil.playerMaxHealth;
				GameLogic.initializeGui();
				GameLogic.trainingLogic();
			}	
		}
		
		function strengthUpgrade() {
			upgradePrice = RogueUtil.playerStrength * 25;
			if (RogueUtil.playerCoins < upgradePrice){
				RogueUtil.playerInTraining = false;
			}
			if (!RogueUtil.playerInTraining){
				// Reset GUI once player is done training.
				GameLogic.initializeGui();			
			}
			if (RogueUtil.playerCoins > upgradePrice){
				$('.trainingStrengthPrice').remove();
				RogueUtil.playerCoins-=upgradePrice;
				RogueUtil.playerStrength +=5;
				GameLogic.initializeGui();
				GameLogic.trainingLogic();
			}
		}
		
		function agilityUpgrade() {
			upgradePrice = RogueUtil.playerAgility * 25;
			if (RogueUtil.playerCoins < upgradePrice){
				RogueUtil.playerInTraining = false;
			}
			if (!RogueUtil.playerInTraining){
				// Reset GUI once player is done training.
				GameLogic.initializeGui();			
			}
			if (RogueUtil.playerCoins > upgradePrice){
				$('.trainingAgilityPrice').remove();
				RogueUtil.playerCoins-=upgradePrice;
				RogueUtil.playerAgility +=5;
				GameLogic.initializeGui();
				GameLogic.trainingLogic();
			}
		}
		
		function armorUpgrade() {
			upgradePrice = RogueUtil.playerArmor * 25;
			if (RogueUtil.playerCoins < upgradePrice){
				RogueUtil.playerInTraining = false;
			}
			if (!RogueUtil.playerInTraining){
				// Reset GUI once player is done training.
				GameLogic.initializeGui();			
			}
			if (RogueUtil.playerCoins > upgradePrice){
				$('.trainingArmorPrice').remove();
				RogueUtil.playerCoins-=upgradePrice;
				RogueUtil.playerArmor +=5;
				GameLogic.initializeGui();
				GameLogic.trainingLogic();
			}
		}
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Function that controls logic for coins.
	static coinFunctionality() {
		$('.chest-message').remove();
		let coinValue = Math.floor(Math.random() * 100);
		RogueUtil.playerCoins += coinValue; // coin reward for opening chest.
		RogueUtil.playerScore += coinValue;
		// Coin counter at top of screen.
		$('.coins').remove();
		GameLogic.initializeGui();
		$(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).find('.chest').remove();
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Gets the name of the player.
	static getPlayerName() {
		let nameBox = $('<div class="playerNameBox d-flex flex-column justify-evenly text-center px-2 border" style="position: fixed;"><input class="text-center" style="color: black; background-color: white;" type="text" placeholder="Enter Your Name: " id="playerNameInput"><button style="color: black; background-color: white;" id="submit-name">Submit Name</button></div>');
		RogueUtil.gameScreen.append(nameBox);
		$('#submit-name').on("click", function() {RogueUtil.playerNameSubmitted = true; RogueUtil.playerName = $('#playerNameInput').val(); $('.playerNameBox').remove(); GameLogic.initializeGui(); console.log(RogueUtil.playerName);});
	}
//-----------------------------------------------------------------------------------------------------------------------//
	// Starts the new game.
	static initializeGui(){
		
		// Remove all old elements.
		$('.coins').remove();
		$('.health').remove();
		$('.strength').remove();
		$('.agility').remove();
		$('.armor').remove();
		$('.trainingHealthButton').remove();
		$('.trainingStrengthButton').remove();
		$('.trainingAgilityButton').remove();
		$('.trainingArmorButton').remove();
		$('.trainingHealthPrice').remove();
		$('.trainingStrengthPrice').remove();
		$('.trainingAgilityPrice').remove();
		$('.trainingArmorPrice').remove();
		$('.playerName').remove();
		
		// playerName
		let playerName = $(`<div class="d-flex playerName text-center px-2 border" style="font-weight: bold; color: white;">${RogueUtil.playerName} Level: ${RogueUtil.currentPlayerLevel}</div>`);
		
		// Element to append player information to.
		let messages = $(`<div class='d-flex flex-row messages' style='z-index: 1; background-color: transparent;'></div>`);
		
		// Display playerCoins on game start.
		let coinMessage = $(`<div class='d-flex coins text-center px-2 border' style='z-index: 1; color: yellow; background-color: transparent;'>Coins: ${RogueUtil.playerCoins}</div>`); // Coint counter at top of screen.
		messages.append(coinMessage);
		
		// Display playerStats on game start.
		let healthMessage = $(`<div class='d-flex health text-center px-2 border' style='z-index: 1; color: red; background-color: transparent;'>Health: <br>${RogueUtil.playerCurrentHealth} / ${RogueUtil.playerMaxHealth}</div>`); // Coint counter at top of screen.
		messages.append(healthMessage);
		let strengthMessage = $(`<div class='d-flex strength text-center px-2 border' style='z-index: 1; color: pink; background-color: transparent;'>Strength: ${RogueUtil.playerStrength}</div>`); // Coint counter at top of screen.
		messages.append(strengthMessage);
		let agilityMessage = $(`<div class='d-flex agility text-center px-2 border' style='z-index: 1; color: green; background-color: transparent;'>Agility: ${RogueUtil.playerAgility}</div>`); // Coint counter at top of screen.
		messages.append(agilityMessage);
		let armorMessage = $(`<div class='d-flex armor text-center px-2 border' style='z-index: 1; color: grey; background-color: transparent;'>Armor: ${RogueUtil.playerArmor}</div>`); // Coint counter at top of screen.
		messages.append(armorMessage);	

		// Appending messages.
		RogueUtil.gameScreen.append(playerName);
		RogueUtil.gameScreen.append(messages);		
	}
//-----------------------------------------------------------------------------------------------------------------------//	
	// Searches for enemies.
	static enemySearch(){
		if (!RogueUtil.playerInBattle){
			// Checking if an enemy has appeared within player visibility
			for (let i=0; i<RogueUtil.tileNumberPerLargeGridRow; i++){
				for (let j=0; j<RogueUtil.tileNumberPerLargeGridRow; j++){
					
					let cellID = `${RogueUtil.gridLetters[i]}${j}`;
					if (cellID == RogueUtil.playerPosition[0] + RogueUtil.playerPosition[1]){
						// Array that holds surrounding positions of visibility for player.
						let cellIDArr = [`${RogueUtil.gridLetters[i]}${j}`,`${RogueUtil.gridLetters[i-1]}${j}`,`${RogueUtil.gridLetters[i+1]}${j}`,
										 `${RogueUtil.gridLetters[i]}${j-1}`,`${RogueUtil.gridLetters[i]}${j+1}`,`${RogueUtil.gridLetters[i-1]}${j-1}`,
										 `${RogueUtil.gridLetters[i+1]}${j+1}`,`${RogueUtil.gridLetters[i+1]}${j-1}`,`${RogueUtil.gridLetters[i-1]}${j+1}`];
						let k = 0;
						while (k < cellIDArr.length){
							cellID = $("#" + cellIDArr[k]);
							if (cellID.find('.enemy').length){
								if (RogueUtil.enemyDefeated){
									// Enemy text displayed. Moved from environmentGraphics().
									let message = $('<div class="d-flex enemy-message text-center" style="z-index: 1; position: fixed; color: red; background-color: transparent; font-weight: bold;">F to fight, or E to attempt an escape!</div>');
									$(`#${RogueUtil.playerPosition[0]}${RogueUtil.playerPosition[1]}`).append(message);
									RogueUtil.playerInBattle = true;
									RogueUtil.enemyDefeated = false;
									RogueUtil.currentEnemyLocation = cellID;
								}
							}
							k++;
						}
					}
					
				}
			}
		}
	}
//-----------------------------------------------------------------------------------------------------------------------//	
}