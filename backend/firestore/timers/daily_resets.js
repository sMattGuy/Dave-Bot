const { updateDoc, doc, collection, writeBatch } = require("firebase/firestore");
const getTimers = require("../utility/getTimers");
const { db } = require("../../db");
const getUsers = require("../main/getUsers");

const dailyResets = async () => {
    // manual DATE reset
    /*const timersRef = doc(db, 'assets', 'timers');
    await updateDoc(timersRef, {
        'date': new Date()
    })*/

    const checkToday = (date) => {
        let today = new Date();
        today = new Date(today - (5 * 60 * 60 * 1000));
        today = today.toUTCString();
        today = new Date(today).getUTCDate();
        const checkDay = new Date(date).getUTCDate();

        if (today === checkDay) return true;
        return false;
    }

    const reset = async () => {
        // all data to reset, ex: users daily jerks
        const usersData = await getUsers();
        const usersBatch = writeBatch(db);

        Object.keys(usersData).forEach(id => {
            const userRef = doc(db, 'users', id);
            usersBatch.update(userRef, {
                'stats.jerks': 0
            });
        });

        await usersBatch.commit();
    }
    
    setInterval(async () => {
        const timersData = await getTimers();
        const timersRef = doc(db, 'assets', 'timers');

        if (!checkToday(timersData.date)) {
            console.log('BOT: Jerks Reset')

            // converts to utc minus 5 to be 12 midnight est
            let changeDate = new Date();
            changeDate = new Date(changeDate - (5 * 60 * 60 * 1000));
            changeDate = changeDate.toUTCString();
            await updateDoc(timersRef, {
                'date': changeDate
            });
            await reset();
        }
    }, 30000);
}

module.exports = dailyResets;