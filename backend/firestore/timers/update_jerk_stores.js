const { writeBatch, doc, increment } = require("firebase/firestore");
const { db } = require("../../db");
const getUsers = require("../main/getUsers");

const updateJerkStores = async () => {
    const jerkMult = 1.03;
    const baseJerkAmt = 3;

    setInterval(async () => {
        console.log(`update jerk stores`);

        try {
            const usersData = await getUsers();
            const storesBatch = writeBatch(db);

            Object.keys(usersData).forEach(id => {
                let currentJerkStores = usersData[id].stats.jerkStores;

                if (currentJerkStores >= 200) return;

                const userRef = doc(db, 'users', id);
                if (currentJerkStores >= 185) { // bigger jump at the end to avoid 199 to 200 increase of 1
                    storesBatch.update(userRef, {
                        'stats.jerkStores': 200
                    });
                }
                else if (currentJerkStores < 3) {
                    storesBatch.update(userRef, {
                        'stats.jerkStores': 3
                    });
                }
                else {
                    let newStoresAmt = Math.floor((currentJerkStores + baseJerkAmt) * jerkMult)
                    if (newStoresAmt > 200) newStoresAmt = 200;
                    storesBatch.update(userRef, {
                        'stats.jerkStores': newStoresAmt
                    });
                }
            });

            await storesBatch.commit();
        } catch (err) {
            console.log(err);
        }
    }, 180000);
}

module.exports = updateJerkStores;