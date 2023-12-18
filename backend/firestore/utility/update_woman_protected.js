const { doc, updateDoc, increment } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateWomanProtected = async (user, nut) => {
    const userRef = doc(db, 'users', user.id);

    try {
        await updateDoc(userRef, {
            'items.backpack.woman.nutBlocked': increment(nut)
        });
    } catch (err) {
        console.log(`BOT: ${err} @ updateWomanStatus function`);
    }
}