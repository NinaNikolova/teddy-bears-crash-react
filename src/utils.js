import {winSound, winSound1} from "./assets.js"

export const handleUserInteraction = () => {
    const audio = new Audio(winSound);
    audio.volume = 0.3;
    audio.play().catch((error) => {
        console.log('Playback prevented: ', error);
    });
};

export const handleUserWin = () => {
    const audio = new Audio(winSound1);
    audio.volume = 0.3;
    audio.play().catch((error) => {
        console.log('Playback prevented: ', error);
    });

};