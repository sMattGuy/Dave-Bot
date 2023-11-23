const { doc, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

const getTimers = async () => {
    const timersRef = doc(db, 'assets', 'timers');
    const timersSnap = await getDoc(timersRef);

    return timersSnap.data();
}

module.exports = getTimers;