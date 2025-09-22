// Prime Number Finder - Finds the first 100 prime numbers
// Created for CyborgShell environment

api.cls();

api.print("Finding the first 100 prime numbers...");
api.print("");

var primes = [];
var num = 2;

// Function to check if a number is prime
function isPrime(n) {
	if (n < 2) return false;
	if (n === 2) return true;
	if (n % 2 === 0) return false;

	for (var i = 3; i * i <= n; i += 2) {
		if (n % i === 0) return false;
	}
	return true;
}

// Find the first 100 prime numbers
while (primes.length < 100) {
	if (isPrime(num)) {
		primes.push(num);
	}
	num++;
}

// Display the results
api.print("The first 100 prime numbers are:");
api.print("");

// Print primes in rows of 10 for better formatting
for (var i = 0; i < primes.length; i += 10) {
	var output = "";
	for (var j = 0; j < 10 && (i + j) < primes.length; j++) {
		var numStr = primes[i + j].toString();
		// Simple padding with spaces
		while (numStr.length < 4) {
			numStr = " " + numStr;
		}
		output += numStr;
	}
	api.print(output);
}

api.print("");
api.print("Total primes found: " + primes.length);
api.print("Largest prime: " + primes[primes.length - 1]);
api.print("");
api.print("Program completed successfully!");