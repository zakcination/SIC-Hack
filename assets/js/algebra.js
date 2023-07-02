window.onload = function() {
    setRandomNumbers();
    // Set the initial score in the span
    let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
    document.querySelector('.score').textContent = "Score: " + score;
}


function setRandomNumbers() {
    // Get the span elements
    let span1 = document.querySelector('.random1');
    let span2 = document.querySelector('.random2');

    // Generate random numbers from 0 to 100
    let randomNumber1 = Math.floor(Math.random() * 101);
    let randomNumber2 = randomNumber1 + Math.floor(Math.random() * (100 - randomNumber1 + 1));

    // Set the textContent of the spans to the random numbers
    span1.textContent = randomNumber1;
    span2.textContent = randomNumber2;
}

function checkAnswer() {
    // Get the input element and its value
    let input = document.getElementById('answer');
    let userAnswer = parseInt(input.value);

    // Get the span elements and their values
    let span1 = document.querySelector('.random1');
    let span2 = document.querySelector('.random2');
    let num1 = parseInt(span1.textContent);
    let num2 = parseInt(span2.textContent);

    // Calculate the correct answer
    let correctAnswer = num2 - num1;
    
    // Initialize the score
    let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

    // Check if the user's answer is correct
    if (userAnswer === correctAnswer) {
        score++;
        localStorage.setItem('score', score);
    } else {
        alert("Incorrect. The correct answer was " + correctAnswer + ".");
    }
    
    document.querySelector('.score').textContent = "Score: " + score;

    // Generate new random numbers
    setRandomNumbers();
}

document.getElementById('btn-1').onclick = function () {
    location.href = 'algebra.html';
};