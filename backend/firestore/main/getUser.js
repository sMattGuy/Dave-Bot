const { doc, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

const getUser = async (user) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);
    return userSnap.data();
}

module.exports = getUser;