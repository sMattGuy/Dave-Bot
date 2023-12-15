const { doc, updateDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateWomanStatus = async (user, state) => {
    const userRef = doc(db, 'users', user.id);

    try {
        await updateDoc(userRef, {
            'items.backpack.woman.active': state
        });
    } catch (err) {
        console.log(`BOT: ${err} @ updateWomanStatus function`);
    }
}