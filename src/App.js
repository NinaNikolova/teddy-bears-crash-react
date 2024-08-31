/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ScoreBoard from './components/ScoreBoard';

import {
    blueBear, greenBear, orangeBear, purpleBear, redBear, yellowBear,
    blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy,
    princess1, princess2, princess3, princess4, princess5, princess6,
    pony1, pony2, pony3, pony4, pony5, pony6,
    blank, winSound, winSound1
} from './assets.js';

import Controls from "./components/Controls.js";
import Logo from "./components/Logo.js";

const width = 8;

const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];
const bearColors = [blueBear, greenBear, orangeBear, purpleBear, redBear, yellowBear];
const princessColors = [princess1, princess2, princess3, princess4, princess5, princess6];
const ponyColors = [pony1, pony2, pony3, pony4, pony5, pony6];

const App = () => {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
    const [squareBeingDragged, setSquareBeingDragged] = useState(null);
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
    const [scoreDisplay, setScoreDisplay] = useState(0);

    const [gameType, setGameType] = useState('candy');
    const [thumbsUp, setThumbsUp] = useState(false); // State for thumbs-up animation
    const [win, setWin] = useState(false); // State for win animation
    const [gameStarted, setGameStarted] = useState(false); // New state

    const colors = gameType === 'candy' ? candyColors
        : gameType === 'bear' ? bearColors
            : gameType === 'princess' ? princessColors
                : gameType === 'pony' ? ponyColors
                    : candyColors;

    const handleUserInteraction = () => {
        const audio = new Audio(winSound);
        audio.volume = 0.3;
        audio.play().catch((error) => {
            console.log('Playback prevented: ', error);
        });
    };

    // Function to reset the game
    const resetGame = () => {
        setScoreDisplay(0);
        createBoard(); // Recreate the board
        setWin(false); // Reset win state
        setGameStarted(true);
    };

    const handleUserWin = () => {
        const audio = new Audio(winSound1);
        audio.volume = 0.3;
        audio.play().catch((error) => {
            console.log('Playback prevented: ', error);
        });

    };
    const handleScoreIncrease = (points) => {
        if (gameStarted === true) {
            setScoreDisplay((score) => {
                const newScore = score + points;
                setThumbsUp(true);
                handleUserInteraction(); // Trigger thumbs-up animation
                setTimeout(() => setThumbsUp(false), 600); // Reset thumbs-up animation after it ends

                if (newScore >= 200) { // Adjust this condition as per your win criteria
                    setWin(true);
                    handleUserWin(); // Play win sound

                    // Reset win state and score after 6 seconds
                    setTimeout(() => {
                        setWin(false);
                        setScoreDisplay(0);
                    }, 6000);

                    return 0; // Reset score immediately
                }

                return newScore;
            });
        }
    }


    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                handleScoreIncrease(4);

                columnOfFour.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = currentColorArrangement[i];
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
            const isBlank = currentColorArrangement[i] === blank;
            if (notValid.includes(i)) continue;
            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                handleScoreIncrease(4);
                rowOfFour.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;
            if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                handleScoreIncrease(3);
                columnOfThree.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = currentColorArrangement[i];
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
            const isBlank = currentColorArrangement[i] === blank;
            if (notValid.includes(i)) continue;
            if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                handleScoreIncrease(3);
                rowOfThree.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(Math.random() * colors.length);
                currentColorArrangement[i] = colors[randomNumber];
            }
            if ((currentColorArrangement[i + width]) === blank) {
                currentColorArrangement[i + width] = currentColorArrangement[i];
                currentColorArrangement[i] = blank;
            }
        }
    }

    const dragStart = (e) => {
        setSquareBeingDragged(e.target);
    }
    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target);
    }
    const dragEnd = () => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColumnOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree = checkForRowOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
        } else {
            currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setCurrentColorArrangement([...currentColorArrangement])
        }
    }
    const touchStart = (e) => {
        setSquareBeingDragged(e.targetTouches[0].target);
    };

    const touchMove = (e) => {
        e.preventDefault(); // Prevent scrolling when moving touch
        setSquareBeingReplaced(document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY));
    };

    const touchEnd = () => {
        dragEnd();
    };
    const createBoard = () => {
        const randomColorArrangement = [];
        for (let i = 0; i < width * width; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)]
            randomColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(randomColorArrangement)
    }

    useEffect(() => {
        setScoreDisplay(0);
        setGameStarted(false)
        createBoard()
    }, [gameType])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 300)
        return () => clearInterval(timer)
    }, [currentColorArrangement])

    return (
        <div className="app">
            <Logo />
            <Controls gameType={gameType} setGameType={setGameType} resetGame={resetGame} gameStarted={gameStarted} thumbsUp={thumbsUp} />
            <div className="game">
                {currentColorArrangement.map((color, index) => (
                    <img
                        key={index}
                        src={color}
                        alt={color}
                        data-id={index}
                        draggable={true}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                        onTouchStart={touchStart}
                        onTouchMove={touchMove}
                        onTouchEnd={touchEnd}
                    />
                ))}
            </div>
            {!win && <ScoreBoard score={scoreDisplay} />}
            {win && (<><div className="loader"></div><span className="loader1"></span></>)}
        </div>
    )
}

export default App;