const { doc, updateDoc, increment, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.addUpgrade = async (user, itemId, itemData, currency) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    const upgrades = userSnap.data().items.upgrades;

    try {
        await updateDoc(userRef, {
            [`stats.${currency}`]: increment(-itemData.priceBase),
            'items.upgrades': backpack
        })
    } catch (err) {
        console.log(`BOT: ${err} @ addUpgrade function`);
    }
}