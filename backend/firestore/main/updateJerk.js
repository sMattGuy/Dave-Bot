const { doc, getDoc, updateDoc, increment } = require("firebase/firestore");
const { db } = require("../../db");
const addUser = require("../utility/addUser");
const getUser = require("./getUser");

const updateJerk = async (user) => {
    const userRef = doc(db, 'users', user.id);
    let userSnap = await getDoc(userRef);

    const exists = userSnap.exists();
    if(!exists) {
        await addUser(user);
        userSnap = await getDoc(userRef);

        return 'no user';
    }

    if (userSnap.data().stats.jerks === userSnap.data().stats.maxJerks) return 'max jerks';

    await updateDoc(userRef, {
        'stats.jerks': increment(1),
        'stats.nut': increment(userSnap.data().stats.jerkStores),
        'stats.jerkStores': 0,
        'stats.preNut': userSnap.data().stats.jerkStores
    });

    return await getUser(user);
}

module.exports = updateJerk;