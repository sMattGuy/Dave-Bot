const { doc, getDoc } = require("firebase/firestore")
const { db } = require("../../db");
const addUser = require("../utility/addUser");

const getUser = async (user) => {
    const userRef = doc(db, 'users', user.id);
    let userSnap = await getDoc(userRef);

    const exists = userSnap.exists();
    if(!exists) {
        await addUser(user);
        userSnap = await getDoc(userRef);
    }

    return userSnap.data();
}

module.exports = getUser;