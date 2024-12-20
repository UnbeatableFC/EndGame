import Header from "./Components/Header";
import "./App.css";
import { languages } from "./Components/languages";
import { useState } from "react";
import React from "react";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./Components/utils";
import Confetti from "react-confetti";

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());

  const numberOfGuessLeft = languages.length - 1;

  const [guessedLetters, setGuessedLetters] = useState([]);

  const wrongGuessedCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameLost = true ? wrongGuessedCount === numberOfGuessLeft : false;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameOver = isGameLost || isGameWon;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  const languageChip = languages.map((language, index) => {
    const isLangLost = index < wrongGuessedCount;
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };

    const className = clsx("lang-names", isLangLost && "lost");
    return (
      <span className={className} key={language.name} style={styles}>
        {language.name}
      </span>
    );
  });

  const display = currentWord.split("").map((char, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(char);
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(char) && "missed-letter"
    );

    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? char.toUpperCase() : ""}
      </span>
    );
  });

  const keyboard = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        key={index}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const styling = {
    display: null,
  };

  const gameStatus = clsx("status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: isLastGuessIncorrect && !isGameOver,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessedCount - 1].name)}!
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2> You win!</h2>
          <p>Well Done!</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2> Game Over!</h2>
          <p>You Lose! Better start learning Assembly</p>
        </>
      );
    }

    return null;
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  return (
    <>
      {" "}
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <Header />
      <section className={gameStatus} aria-live="polite" role="status">
        {renderGameStatus()}
      </section>
      <section className="chips">{languageChip}</section>
      <section className="word">{display}</section>
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
          You have {numberOfGuessLeft} attempts left.
        </p>
        <p>
          Current Word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank"
            )
            .join(" ")}
        </p>
      </section>
      <section className="keyboard">{keyboard}</section>
      <section className="btn-sect">
        {isGameOver && (
          <button className="btn" onClick={startNewGame}>
            New Game
          </button>
        )}
      </section>
    </>
  );
}

export default App;
