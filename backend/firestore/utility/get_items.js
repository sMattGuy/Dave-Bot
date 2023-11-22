const { doc, getDoc } = require("firebase/firestore")
const { db } = require("../../db")

const getItems = async () => {
    const itemsRef = doc(db, 'assets', 'items');
    const itemsSnap = await getDoc(itemsRef);

    return itemsSnap.data();
}

module.exports = getItems;