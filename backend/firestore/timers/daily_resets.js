const { updateDoc, doc, collection, writeBatch } = require("firebase/firestore");
const getTimers = require("../utility/getTimers");
const { db } = require("../../db");
const getUsers = require("../main/getUsers");

const dailyResets = async () => {
    const checkToday = (date) => {
        const today = new Date();
        console.log(today);

        if (today.toDateString() === date.toDateString()) return true;
        return false;
    }

    const reset = async () => {
        // all data to reset, ex: users daily jerks
        const usersData = getUsers();
        const usersBatch = writeBatch(db);

        Object.keys(usersData).forEach(id => {
            const userRef = doc(db, 'users', id);
            usersBatch.update(userRef, {
                'stats.jerks': usersData[id].stats.maxJerks
            });
        });

        await usersBatch.commit();
    }
    
    setInterval(async () => {
        const timersData = getTimers();
        const timersRef = doc(db, 'assets', 'timers');

        if (!checkToday(timersData.date)) {
            await updateDoc(timersRef, {
                'date': new Date()
            });
            await reset();
        }
    }, 60000);
}

module.exports = dailyResets;