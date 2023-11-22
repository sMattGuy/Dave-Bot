const { collection, updateDoc, getDocs, doc } = require("firebase/firestore")
const { db } = require("../../db")
const getUsers = require("../main/getUsers")

const clearJerk = async () => {
    const usersData = await getUsers();

    Object.keys(usersData).forEach(userId => {
        updateDoc(doc(db, 'users', userId), {
            'stats.dailyJerks': 0
        });
    });
};

module.exports = clearJerk;