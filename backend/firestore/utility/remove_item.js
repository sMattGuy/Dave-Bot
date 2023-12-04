const { doc, updateDoc, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.removeItem = async (user, itemData) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    const backpack = userSnap.data().items.backpack;

    if (itemData?.quantity) {
        itemData.quantity === 1
        ? delete backpack[itemData.id]
        : backpack[itemData.id].quantity--;
    }
    else itemData.uses === 1
        ? delete backpack[itemData.id]
        : backpack[itemData.id].uses--

    try {
        await updateDoc(userRef, {
            'items.backpack': backpack
        })
    } catch (err) {
        console.log(`BOT: ${err} @ removeItem function`);
    }
};