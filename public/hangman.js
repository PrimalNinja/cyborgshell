// Hangman game

// Get a random word from a list of words
var words = ["apple", "banana", "cherry", "date", "elderberry"];
var word = words[Math.floor(Math.random() * words.length)];

// Create the game state
var state = {
	word: word,
	guesses: [],
	lives: 6
};

// Create the game UI
var html = '<h1>Hangman</h1>' +
'<p id="word"></p>' +
'<p id="lives"></p>' +
'<input id="guess" type="text">' +
'<button id="submit">Guess</button>';

// Open a new tab and render the game UI
var newTab = window.open();
newTab.document.write(html);

// Update the game UI with the current state
function updateUI() {
	newTab.document.getElementById('word').innerText = state.word.split('').map(function(char) {
		return state.guesses.includes(char) ? char : '_';
		}).join(' ');
		newTab.document.getElementById('lives').innerText = 'Lives: ' + state.lives;
	}

	// Handle guesses
	newTab.document.getElementById('submit').addEventListener('click', function() {
		var guess = newTab.document.getElementById('guess').value;
		if (guess.length !== 1) {
			alert('Please guess a single letter!');
			return;
		}
		if (state.guesses.includes(guess)) {
			alert('You already guessed that letter!');
			return;
		}
		state.guesses.push(guess);
		if (!state.word.includes(guess)) {
			state.lives--;
		}
		updateUI();
		if (state.lives === 0) {
			alert('Game over! The word was ' + state.word);
			newTab.close();
			} else if (state.word.split('').every(function(char) { return state.guesses.includes(char); })) {
				alert('Congratulations! You won!');
				newTab.close();
			}
		});

		// Add an event listener to the input field to handle keyboard input
		newTab.document.getElementById('guess').addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				newTab.document.getElementById('submit').click();
			}
		});

		// Add a CSS style to the new tab to make it look nicer
		var style = newTab.document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = 'body { font-family: Arial, sans-serif; } #word { font-size: 24px; } #lives { font-size: 18px; } #guess { width: 50px; height: 30px; font-size: 18px; } #submit { width: 100px; height: 30px; font-size: 18px; }';
		newTab.document.head.appendChild(style);

		// Add a function to draw the hangman figure
		function drawHangman(lives) {
			var canvas = newTab.document.createElement('canvas');
			canvas.width = 200;
			canvas.height = 200;
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.moveTo(100, 10);
			ctx.lineTo(100, 190);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(100, 10);
			ctx.lineTo(50, 50);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(100, 10);
			ctx.lineTo(150, 50);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(100, 50);
			ctx.lineTo(100, 70);
			ctx.stroke();
			if (lives < 6) {
				ctx.beginPath();
				ctx.arc(100, 80, 10, 0, 2 * Math.PI);
				ctx.stroke();
			}
			if (lives < 5) {
				ctx.beginPath();
				ctx.moveTo(100, 90);
				ctx.lineTo(100, 110);
				ctx.stroke();
			}
			if (lives < 4) {
				ctx.beginPath();
				ctx.moveTo(100, 100);
				ctx.lineTo(80, 120);
				ctx.stroke();
			}
			if (lives < 3) {
				ctx.beginPath();
				ctx.moveTo(100, 100);
				ctx.lineTo(120, 120);
				ctx.stroke();
			}
			if (lives < 2) {
				ctx.beginPath();
				ctx.moveTo(100,120);
				ctx.lineTo(80, 140);
				ctx.stroke();
			}
			if (lives < 1) {
				ctx.beginPath();
				ctx.moveTo(100, 120);
				ctx.lineTo(120, 140);
				ctx.stroke();
			}
			newTab.document.body.appendChild(canvas);
		}

		// Update the hangman figure when the lives change
		function updateHangman() {
			var lives = state.lives;
			var canvas = newTab.document.querySelector('canvas');
			if (canvas) {
				canvas.remove();
			}
			drawHangman(lives);
		}

		// Call updateHangman when the lives change
		newTab.document.getElementById('submit').addEventListener('click', function() {
			updateHangman();
		});

		// Initialize the hangman figure
		updateHangman();