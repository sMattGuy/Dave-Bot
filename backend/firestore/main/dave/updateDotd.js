const { doc, updateDoc } = require("firebase/firestore")
const { db } = require("../../../db")

const updateDotd = async (dotdText) => {
    const dotdRef = doc(db, 'dave', 'dotd');

    await updateDoc(dotdRef, {
        text: dotdText
    });
};

module.exports = updateDotd;