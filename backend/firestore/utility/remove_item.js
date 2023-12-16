const { doc, updateDoc, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

exports.removeItem = async (user, itemData, lastUse) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    const backpack = userSnap.data().items.backpack;

    if (itemData?.quantity) {
        itemData.quantity === 1
        ? delete backpack[itemData.id]
        : backpack[itemData.id].quantity--;
    }
    else if (itemData?.uses) {
        itemData.uses === 1
        ? delete backpack[itemData.id]
        : backpack[itemData.id].uses--;
    }
    else if (itemData?.noUses) {
        backpack[itemData.id].active = false;
    }

    if (lastUse && backpack?.[itemData.id]) {
        const date = new Date();
        backpack[itemData.id].cooldown.lastUse = date.toUTCString();
    }

    try {
        await updateDoc(userRef, {
            'items.backpack': backpack
        })
    } catch (err) {
        console.log(`BOT: ${err} @ removeItem function`);
    }
};