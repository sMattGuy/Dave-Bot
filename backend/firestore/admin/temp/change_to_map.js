const { collection, getDocs, updateDoc, doc } = require("firebase/firestore")
const { db } = require("../../../db")

exports.changeToMap = async () => {
    const usersColl = collection(db, 'users');
    const usersSnap = await getDocs(usersColl);

    usersSnap.forEach(async docSnap => {
        if(docSnap.id === 'testuser123') return;
        const docRef = doc(db, 'users', docSnap.id)
        await updateDoc(docRef, {
            'items.backpack': {},
            'items.upgrades': {}
        });
    })
}