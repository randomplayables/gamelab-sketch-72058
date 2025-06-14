import RPLogo2 from './assets/RPLogo2.png';
import React, { useState } from 'react';
import './styles.css';

declare global {
  interface Window {
    sendDataToGameLab?: (data: any) => void;
  }
}



export default function App() {
  const [secretNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100!');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    const numericGuess = parseInt(guess, 10);
    if (isNaN(numericGuess)) {
      setMessage('Please enter a valid number.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    let feedback = '';
    if (numericGuess === secretNumber) {
      feedback = `Correct! You guessed it in ${newAttempts} ${newAttempts === 1 ? 'guess' : 'guesses'}.`;
      setMessage(feedback);
      setGameOver(true);
    } else if (numericGuess < secretNumber) {
      feedback = 'Too low! Try again.';
      setMessage(feedback);
    } else {
      feedback = 'Too high! Try again.';
      setMessage(feedback);
    }
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({
        event: numericGuess === secretNumber ? 'correct' : 'guess',
        guess: numericGuess,
        feedback,
        attempts: newAttempts,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <img src={RPLogo2} alt="Game Logo" className="logo" />
      <h1>Number Guessing Game</h1>
      <p>{message}</p>
      {!gameOver && (
        <div className="guess-area">
          <input
            type="number"
            value={guess}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your guess"
            min="1"
            max="100"
          />
          <button onClick={handleGuess}>Guess</button>
        </div>
      )}
      {gameOver && (
        <button onClick={handleRestart} className="restart-button">
          Play Again
        </button>
      )}
      {!gameOver && <p className="attempts">Attempts: {attempts}</p>}
    </div>
  );
}