const getUser = require("../../../backend/firestore/main/getUser");
const { updateNut } = require("../../../backend/firestore/main/update_nut");

exports.magicLotion = async (action, user) => {
    const userData = user ? await getUser(user) : null;
    if (action) {
        const chance = Math.floor(Math.random() * 2);
        if (chance === 0) {
            await updateNut(user, -userData.stats.preNut);
            return {
                resTitle: '🐍 He sold you snake oil 😔',
                resDesc: 'Your cock is on fire. Yikes..'
            }
        }
        else if (chance === 1) {
            await updateNut(user, userData.stats.preNut * 2);
            return {
                resTitle: "That's a lot of cum! 😄",
                resDesc: `Your penis kind of burns but atleast you extracted 💧 ${userData.stats.preNut * 3}`
            }
        }
    } else {
        return {
            title: 'A strange man knocks on your window while your strokin it.\nHe says he has a magic lotion that can make you nut more than you ever have in return for this jerk.\nTake the deal?'
        }
    }
}