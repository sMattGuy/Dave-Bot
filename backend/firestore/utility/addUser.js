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
            jerks: 0,
            nutBricks: 0,
            nut: 0,
            maxJerks: 5,
            jerkStores: 200,
            leftFootStores: 0,
            rightFootStores: 0,
            preNut: 0
        },
        items: {
            backpack: [],
            upgrades: []
        },
        timer: {

        }
    });
};

module.exports = addUser;