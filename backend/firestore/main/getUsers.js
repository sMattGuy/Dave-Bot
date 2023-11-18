const { getDocs, collection } = require("firebase/firestore")
const { db } = require("../../db")

const getUsers = async () => {
    const usersColl = collection(db, 'users');
    const usersSnap = await getDocs(usersColl);
    
    let usersData = {};

    usersSnap.forEach(doc => {
        if (doc.id === 'testuser123') return;
        usersData[doc.id] = doc.data();
    });

    return usersData;
}

module.exports = getUsers;