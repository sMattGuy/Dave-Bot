const { doc, getDoc } = require("firebase/firestore")
const { db } = require("../../db");

exports.getMerchant = async () => {
    const merchantRef = doc(db, 'assets', 'merchant');
    const merchantSnap = await getDoc(merchantRef);

    return merchantSnap.data();
}