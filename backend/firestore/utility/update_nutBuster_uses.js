const { doc, updateDoc, increment } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateNutBusterUses = async (user, amt) => {
    const userRef = doc(db, 'users', user.id);

    try {
        await updateDoc(userRef, {
            'items.backpack.nut_buster.uses': increment(4)
        });
    } catch (err) {
        console.log(`BOT: ${err} @ updateNutBusterUses`);
    }
}