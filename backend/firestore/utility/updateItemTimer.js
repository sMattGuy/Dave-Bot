const { doc, updateDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateItemTimer = async (user, timerRef) => {
    const userRef = doc(db, 'users', user.id);
    
    try {
        const currTime = new Date()
        await updateDoc(userRef, {
            [`${timerRef}`]: currTime.toUTCString()
        });
    } catch (err) {
        console.log(`BOT: ${err} @ updateItemTimer function`);
    }
}