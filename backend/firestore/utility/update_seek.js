const { doc, updateDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateSeek = async (user, seeked) => {
    const userRef = doc(db, 'users', user.id);

    try {
        await updateDoc(userRef, {
            'stats.lastSeek': seeked
        });
    } catch (err) {
        console.log(`BOT: ${err} @ updateSeek function`);
    }
}