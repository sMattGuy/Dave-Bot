const { doc, updateDoc, getDoc } = require("firebase/firestore")
const { db } = require("../../../db")

const getDotd = async () => {
    const dotdRef = doc(db, 'dave', 'dotd');
    const dotdSnap = await getDoc(dotdRef);

    return dotdSnap.data().dotd;
};

module.exports = getDotd;