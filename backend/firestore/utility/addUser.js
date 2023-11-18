const { doc, setDoc } = require("firebase/firestore")
const { db } = require("../../db")

const addUser = async (user) => {
    const userRef = doc(db, 'users', user.id);

    const date = new Date();
    await setDoc(userRef, {
        created: date.toLocaleDateString(),
        id: user.id,
        username: user.username,
        admin: false,
        stats: {
            averageJerks: 0,
            totalJerks: 0,
            dailyJerks: 0 
        }
    })
}

module.exports = addUser;