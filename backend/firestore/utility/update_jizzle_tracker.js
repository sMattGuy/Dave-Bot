const { doc, updateDoc, increment } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateJizzleTracker = async (win) => {
    const gameDataRef = doc(db, 'assets', 'gameData');

    try {
        if (win) await updateDoc(gameDataRef, {
            'jizzleWinTracker': increment(1)
        });
        else await updateDoc(gameDataRef, {
            'jizzleLossTracker': increment(1)
        });
        
    } catch (err) {
        console.log(`BOT: ${err} @ updateJizzleTracker function`);
        
    }
}