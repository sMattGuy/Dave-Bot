const { removeItem } = require("../../../backend/firestore/utility/remove_item");
const { semenSeeker } = require("./semen_seeker");

exports.useItem = async (interaction, userData, itemId, itemsData) => {
    const user = interaction.user;
    const item = itemsData[itemId];
    item.id = itemId;
    switch (itemId) {
        case 'semen_seeker':
            await removeItem(userData, itemId);
            await semenSeeker(interaction, userData, item);
            break;
    }
}