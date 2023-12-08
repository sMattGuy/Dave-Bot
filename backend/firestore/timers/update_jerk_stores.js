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

    const tick = timersData.jerkTick;

    setInterval(async () => {
        //console.log(`update jerk stores`);

        try {
            const usersData = await getUsers();
            const storesBatch = writeBatch(db);

            Object.keys(usersData).forEach(id => {
                let jerkMult = storesData.base.jerkMult;
                let max = storesData.base.max;
                let jumpFrom = storesData.base.jumpFrom;

                let currentJerkStores = usersData[id].stats.jerkStores;
                if (Object.keys(usersData[id].items.upgrades).includes('right_foot_storage')) {
                    max = storesData.foot2.max;
                    jumpFrom = storesData.foot2.jumpFrom;
                    jerkMult = storesData.foot2.jerkMult;
                }
                else if (Object.keys(usersData[id].items.upgrades).includes('left_foot_storage')) {
                    max = storesData.foot1.max;
                    jumpFrom = storesData.foot1.jumpFrom;
                    jerkMult = storesData.foot1.jerkMult;
                }

                /*console.log(max)
                console.log(jumpFrom)
                console.log(jerkMult)*/

                const userRef = doc(db, 'users', id);
                if (currentJerkStores >= max) return; // shouldnt technically need this line
                else if (currentJerkStores >= jumpFrom) { // bigger jump at the end to avoid 199 to 200 increase of 1, etc
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