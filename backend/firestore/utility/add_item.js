const { doc, updateDoc, increment, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.addItem = async (user, itemId, itemData, currency) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    const backpack = userSnap.data().items.backpack;
    if (backpack?.[itemId]) backpack[itemId].quantity++;
    else backpack[itemId] = itemData;

    try {
        await updateDoc(userRef, {
            [`stats.${currency}`]: increment(-itemData.priceBase),
            'items.backpack': backpack
        })
    } catch (err) {
        console.log(`BOT: ${err} @ addItem function`);
    }
}