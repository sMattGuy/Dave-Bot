const { doc, getDoc, updateDoc } = require("firebase/firestore")
const { db } = require("../../db")

const convertNut = async (user) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    let totalNut = userData.stats.nut;
    const nutBlocks = Math.floor(totalNut / 1000);
    totalNut = totalNut - (nutBlocks * 1000);

    await updateDoc(userRef, {
        'stats.nut': totalNut,
        'stats.nutBlocks': nutBlocks
    });
};