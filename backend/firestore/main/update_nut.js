const { doc, getDoc, updateDoc, increment } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateNut = async (user, amt) => {
    const userRef = doc(db, 'users', user.id);

    try {
        await updateDoc(userRef, {
            'stats.nut': increment(amt)
        })
    } catch (err) {
        console.log(`BOT: ${err}`)
    }

    const userSnap = await getDoc(userRef);
    return userSnap.data();
}