const { removeItem } = require("../../../backend/firestore/utility/remove_item");
const { nutBuster } = require("./nut_buster");
const { semenSeeker } = require("./semen_seeker");

const useItem = async (interaction, userData, itemData) => {
    const user = interaction.user;
    switch (itemData.id) {
        case 'semen_seeker':
            await removeItem(userData, itemData);
            await semenSeeker(interaction, userData, itemData);
            break;
        case 'nut_buster':
            await nutBuster(interaction, userData, itemData);
            break;
    }
}

module.exports = useItem;