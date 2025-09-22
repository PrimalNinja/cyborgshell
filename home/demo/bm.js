var startTime;
var stats = {};

// Prime Number Generation
startTime = Date.now();
var count = 0;
for (var i = 2; i < 100000; i++) {
	var isPrime = true;
	for (var j = 2; j <= Math.sqrt(i); j++) {
		if (i % j === 0) {
			isPrime = false;
			break;
		}
	}
	if (isPrime) count++;
}
stats.primeNumbersGenerated = count;
stats.primeNumbersTime = Date.now() - startTime;

// Matrix Multiplication
startTime = Date.now();
var matrixA = [];
var matrixB = [];
for (var i = 0; i < 100; i++) {
	matrixA[i] = [];
	matrixB[i] = [];
	for (var j = 0; j < 100; j++) {
		matrixA[i][j] = Math.random();
		matrixB[i][j] = Math.random();
	}
}
var result = [];
for (var i = 0; i < 100; i++) {
	result[i] = [];
	for (var j = 0; j < 100; j++) {
		var sum = 0;
		for (var k = 0; k < 100; k++) {
			sum += matrixA[i][k] * matrixB[k][j];
		}
		result[i][j] = sum;
	}
}
stats.matrixMultiplicationTime = Date.now() - startTime;

// Fibonacci Sequence
startTime = Date.now();
var fib = [0, 1];
for (var i = 2; i < 10000; i++) {
	fib[i] = fib[i-1] + fib[i-2];
}
stats.fibonacciSequenceTime = Date.now() - startTime;

// Sorting Algorithm
startTime = Date.now();
var arr = [];
for (var i = 0; i < 10000; i++) {
	arr[i] = Math.random();
}
arr.sort(function(a, b) {
	return a - b;
});
stats.sortingAlgorithmTime = Date.now() - startTime;

// Regex Pattern Matching
startTime = Date.now();
var str = '';
for (var i = 0; i < 10000; i++) {
	str += 'hello world ';
}
var regex = /hello/g;
var matches = str.match(regex);
stats.regexPatternMatchingTime = Date.now() - startTime;

// Object Property Access
startTime = Date.now();
var obj = {};
for (var i = 0; i < 10000; i++) {
	obj['prop' + i] = Math.random();
}
var sum = 0;
for (var prop in obj) {
	sum += obj[prop];
}
stats.objectPropertyAccessTime = Date.now() - startTime;

// Array Iteration
startTime = Date.now();
var arr2 = [];
for (var i = 0; i < 10000; i++) {
	arr2[i] = Math.random();
}
var sum2 = 0;
for (var i = 0; i < arr2.length; i++) {
	sum2 += arr2[i];
}
stats.arrayIterationTime = Date.now() - startTime;

// String Concatenation
startTime = Date.now();
var str2 = '';
for (var i = 0; i < 10000; i++) {
	str2 += 'hello world ';
}
stats.stringConcatenationTime = Date.now() - startTime;

// Math Operations
startTime = Date.now();
var sum3 = 0;
for (var i = 0; i < 10000; i++) {
	sum3 += Math.sin(i) + Math.cos(i) + Math.tan(i);
}
stats.mathOperationsTime = Date.now() - startTime;

// Output stats
api.print('Benchmark Results:');
api.print('---------------------');
api.print('Prime Numbers Generated: ' + stats.primeNumbersGenerated);
api.print('Prime Numbers Time: ' + stats.primeNumbersTime + 'ms');
api.print('Matrix Multiplication Time: ' + stats.matrixMultiplicationTime + 'ms');
api.print('Fibonacci Sequence Time: ' + stats.fibonacciSequenceTime + 'ms');
api.print('Sorting Algorithm Time: ' + stats.sortingAlgorithmTime + 'ms');
api.print('Regex Pattern Matching Time: ' + stats.regexPatternMatchingTime + 'ms');
api.print('Object Property Access Time: ' + stats.objectPropertyAccessTime + 'ms');
api.print('Array Iteration Time: ' + stats.arrayIterationTime + 'ms');
api.print('String Concatenation Time: ' + stats.stringConcatenationTime + 'ms');
api.print('Math Operations Time: ' + stats.mathOperationsTime + 'ms');
api.end();