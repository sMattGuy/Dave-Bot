const { writeBatch, doc, increment } = require("firebase/firestore");
const { db } = require("../../db");
const getUsers = require("../main/getUsers");
const getTimers = require("../utility/getTimers");

const updateJerkStores = async () => {
    const timersData = await getTimers();
    const baseJerkAmt = 3;
    const storesData = {
        base: {
            max: 200,
            jumpFrom: 185,
            jerkMult: 1.03
        },
        foot1: {
            max: 400,
            jumpFrom: 385,
            jerkMult: 1.035
        },
        foot2: {
            max: 600,
            jumpFrom: 575,
            jerkMult: 1.04
        }
    }

    let jerkMult = storesData.base.jerkMult;
    let max = storesData.base.max;
    let jumpFrom = storesData.base.jumpFrom;

    const tick = timersData.jerkTick;

    setInterval(async () => {
        //console.log(`update jerk stores`);

        try {
            const usersData = await getUsers();
            const storesBatch = writeBatch(db);

            Object.keys(usersData).forEach(id => {
                let currentJerkStores = usersData[id].stats.jerkStores;
                if (usersData[id].items.upgrades?.foot_storage?.level === 1) {
                    max = storesData.foot1.max;
                    jumpFrom = storesData.foot1.jumpFrom;
                    jerkMult = storesData.foot1.jerkMult;
                }
                else if (usersData[id].items.upgrades?.foot_storage?.level === 2) {
                    max = storesData.foot2.max;
                    jumpFrom = storesData.foot2.jumpFrom;
                    jerkMult = storesData.foot2.jerkMult;
                }

                if (currentJerkStores >= max) return;

                const userRef = doc(db, 'users', id);
                if (currentJerkStores >= jumpFrom) { // bigger jump at the end to avoid 199 to 200 increase of 1
                    storesBatch.update(userRef, {
                        'stats.jerkStores': max
                    });
                }
                else if (currentJerkStores < 3) {
                    storesBatch.update(userRef, {
                        'stats.jerkStores': 3
                    });
                }
                else {
                    let newStoresAmt = Math.floor((currentJerkStores + baseJerkAmt) * jerkMult)
                    if (newStoresAmt > max) newStoresAmt = max;
                    storesBatch.update(userRef, {
                        'stats.jerkStores': newStoresAmt
                    });
                }
            });

            await storesBatch.commit();
        } catch (err) {
            console.log(err);
        }
    }, (tick * 60000));
}

module.exports = updateJerkStores;