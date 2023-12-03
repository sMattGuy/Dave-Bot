const { doc, updateDoc, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.removeItem = async (user, itemId) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    const backpack = userSnap.data().items.backpack;
    const removeIndex = backpack.indexOf(itemId);
    backpack.splice(removeIndex, 1);

    try {
        await updateDoc(userRef, {
            'items.backpack': backpack
        })
    } catch (err) {
        console.log(`BOT: ${err}`);
    }
};