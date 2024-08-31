import React from 'react';
import thumbsUpImage from '../images/thumbs-up.png'
const Controls = ({ gameType, setGameType, resetGame, gameStarted, thumbsUp }) => {
    return (
        <>
        <div className="controls">
            <label htmlFor="gameType"></label>
            <select id="gameType" value={gameType} onChange={(e) => setGameType(e.target.value)}>
                <option value="candy">🍬 Candy</option>
                <option value="bear">🧸 Bear</option>
                <option value="princess">👸 Princess</option>
                <option value="pony">🦄 Pony</option>
            </select>
            
          
            {thumbsUp && (
                    <img
                        src={thumbsUpImage}
                        alt="Thumbs Up"
                        className="thumbs-up-animation"

                    />
                )}
        </div>
        <div className="gameStart">
              {!gameStarted&&(<button className="btn" onClick={resetGame}>Start Game</button>)}
        </div>
        </>
    );
};

export default Controls;