const { doc, getDoc, updateDoc, increment } = require("firebase/firestore")
const { db } = require("../../db")

exports.updateBalls = async (user, amt) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    let totalAmt = 0;
    if (userSnap.data().stats.jerkStores + amt < 0) totalAmt = 0;
    else totalAmt = userSnap.data().stats.jerkStores + amt;

    try {
        await updateDoc(userRef, {
            'stats.jerkStores': totalAmt
        })
    } catch (err) {
        console.log(`BOT: ${err}`)
    }

    return userSnap.data();
}