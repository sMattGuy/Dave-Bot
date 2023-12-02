const { doc, updateDoc, increment, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.addItem = async (user, itemId, cost, currency) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    const backpack = userSnap.data().items.backpack;
    backpack.push(itemId);
    
    try {
        await updateDoc(userRef, {
            [`stats.${currency}`]: increment(-cost),
            'items.backpack': backpack
        })
    } catch (err) {
        console.log(`BOT: ${err}`);
    }
}