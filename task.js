function fibonacciGenerator(n) {
  let fibonacciNumbers = [0, 1];

  for (let i = 2; i < n; i++) {
    fibonacciNumbers[i] = fibonacciNumbers[i - 1] + fibonacciNumbers[i - 2];
  }

  for (let i = 0; i < n; i++) {
    console.log(fibonacciNumbers[i]);
  }
}

fibonacciGenerator(50);
