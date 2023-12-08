const { doc, getDoc } = require("firebase/firestore")
const { db } = require("../../db");
const addUser = require("../utility/addUser");

const getUser = async (user, canAdd) => {
    const userRef = doc(db, 'users', user.id);
    let userSnap = await getDoc(userRef);

    const exists = userSnap.exists();
    if(!exists && !canAdd) {
        await addUser(user);
        userSnap = await getDoc(userRef);
    }
    else if(!exists && canAdd) return false;

    return userSnap.data();
}

module.exports = getUser;