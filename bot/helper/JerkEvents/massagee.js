const getUser = require("../../../backend/firestore/main/getUser");
const { updateNut } = require("../../../backend/firestore/main/update_nut");

exports.massagee = async (action, user) => {
    const userData = user ? await getUser(user) : null;
    if (action) {
        const chance = Math.floor(Math.random() * 2);
        if (chance === 0) {
            await updateNut(user, -userData.stats.preNut);
            return {
                resTitle: '👲 She ran off with your cum! 😔',
                resDesc: 'Your balls are empty, and she was a dude.'
            }
        }
        else if (chance === 1) {
            await updateNut(user, userData.stats.preNut * 2);
            return {
                resTitle: 'That was awesome! 😄',
                resDesc: `The harvest was most bountiful, you extracted 💧 ${userData.stats.preNut * 2}`
            }
        }
    } else {
        return {
            title: 'An asian woman walks up to you claiming\nshe can give you "massajee" in return for this jerk.\nAre you interested?'
        }
    }
}