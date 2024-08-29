/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ScoreBoard from './components/ScoreBoard';
import blueBear from './images/blue.png';
import greenBear from './images/green.png';
import orangeBear from './images/orange.png';
import purpleBear from './images/purple.png';
import redBear from './images/red.png';
import yellowBear from './images/yellow.png';

import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';

import princess1 from './images/princess1.png';
import princess2 from './images/princess2.png';
import princess3 from './images/princess3.png';
import princess4 from './images/princess4.png';
import princess5 from './images/princess5.png';
import princess6 from './images/princess6.png';

import blank from './images/blank.png';

const width = 8;

const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];
const bearColors = [blueBear, greenBear, orangeBear, purpleBear, redBear, yellowBear];
const princessColors = [princess1, princess2, princess3, princess4, princess5, princess6];

const App = () => {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
    const [squareBeingDragged, setSquareBeingDragged] = useState(null);
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
    const [scoreDisplay, setScoreDisplay] = useState(0);
    const [gameType, setGameType] = useState('candy');
    const [thumbsUp, setThumbsUp] = useState(false); // State for thumbs-up animation
    const [win, setWin] = useState(false); // State for win animation


    const colors = gameType === 'candy' ? candyColors
        : gameType === 'bear' ? bearColors
        : gameType === 'princess' ? princessColors
        : candyColors;

        const handleScoreIncrease = (points) => {
            setScoreDisplay((score) => {
                const newScore = score + points;
                setThumbsUp(true); // Trigger thumbs-up animation
                setTimeout(() => setThumbsUp(false), 500); // Reset thumbs-up animation after it ends
    
                if (newScore >= 200) {
                    setWin(true); // Trigger win animation
                }
    
                return newScore;
            });
        }


    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                handleScoreIncrease(4);
                setScoreDisplay((score) => score + 4);
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
                setScoreDisplay((score) => score + 4);
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
                setScoreDisplay((score) => score + 3);
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
                setScoreDisplay((score) => score + 3);
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

    const createBoard = () => {
        const randomColorArrangement = [];
        for (let i = 0; i < width * width; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)]
            randomColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(randomColorArrangement)
    }

    useEffect(() => {
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
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement])

    return (
        <div className="app">
            <div className="controls">
                <label htmlFor="gameType">Choose Game Type: </label>
                <select id="gameType" value={gameType} onChange={(e) => setGameType(e.target.value)}>
                    <option value="candy">Candy</option>
                    <option value="bear">Bear</option>
                    <option value="princess">Princess</option>
                </select>
            </div>
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
                    />
                ))}
            </div>
            <ScoreBoard score={scoreDisplay}/>
        </div>
    )
}

export default App;