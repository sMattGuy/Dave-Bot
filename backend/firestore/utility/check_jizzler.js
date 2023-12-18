const { updateDoc, doc } = require("firebase/firestore");
const getTimers = require("./getTimers");
const { db } = require("../../db");
const { add, isBefore, isAfter, isEqual } = require("date-fns");

exports.checkJizzler = async () => {
    const timersRef = doc(db, 'assets', 'timers');
    const timers = await getTimers();
    const jizzlerActiveTime = 3;

    const currTime = new Date();
    let nextJizzler = Math.floor(Math.random() * 12) + 1
    let jizzlerTime = add(new Date(currTime.getFullYear, currTime.getDay, currTime.getMonth), { hours: 24 + nextJizzler - 5 });

    if (!timers.nextTravelMerchant) {
        try {
            console.log(jizzlerTime)
            await updateDoc(timersRef, {
                'nextTravelMerchant': jizzlerTime.toUTCString()
            });
            return {jizzlerActive: false, jizzler: jizzlerTime.getUTCDate()};
        } catch (err) {
            console.log(`BOT: ${err} @ checkJizzler function`);
        }
    }
    else if (timers.nextTravelMerchant) {
        let nextTime = new Date(timers.nextTravelMerchant)
        let endTime = add(new Date(timers.nextTravelMerchant), { hours: jizzlerActiveTime });
        if (isBefore(currTime, nextTime)) return {jizzlerActive: false, nextTime: nextTime};
        else if (isAfter(currTime, endTime) || isEqual(currTime, endTime)) {
            try {
                await updateDoc(timersRef, {
                    'nextTravelMerchant': jizzlerTime
                });
                return {jizzlerActive: false, nextTime: nextTime};
            } catch (err) {
                console.log(`BOT: ${err} @ checkJizzler function`);
            }
        }
        else return {jizzlerActive: true};
    }
}