const { doc, getDoc, updateDoc, increment } = require("firebase/firestore");
const { db } = require("../../db");
const addUser = require("../utility/addUser");
const getUser = require("./getUser");

const updateJerk = async (user) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    const exists = userSnap.exists();
    if(!exists) {
        await addUser(user);
    }

    await updateDoc(userRef, {
        'stats.dailyJerks': increment(1)
    })
    return await getUser(user);
}

module.exports = updateJerk;