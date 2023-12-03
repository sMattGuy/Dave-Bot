const { EmbedBuilder } = require("discord.js");
const getUsers = require("../../../backend/firestore/main/getUsers");

exports.semenSeeker = async (interaction, userData, item) => {
    const user = interaction.user;
    const usersData = await getUsers();
    const listData = [];

    Object.keys(usersData).forEach(userId => {
        if (usersData[userId].stats.jerkStores >= 50) {
            listData.push(usersData[userId]);
        }
    });

    listData.sort((a, b) => b.stats.jerkStores - a.stats.jerkStores);

    let seekUsers = [];
    const seekFields = [];

    if (listData.length <= 3) {
        seekUsers = listData;
    }
    else {
        seekUsers[0] = Math.floor(Math.random() * listData.length) + 1;
        seekUsers[1] = Math.floor(Math.random() * listData.length) + 1;
        seekUsers[2] = Math.floor(Math.random() * listData.length) + 1;
        while (seekUsers[1] === seekUsers[0] || seekUsers[1] === seekUsers[2]) seekUsers[1] = Math.floor(Math.random() * listData.length) + 1;
        while (seekUsers[2] === seekUsers[0] || seekUsers[2] === seekUsers[1]) seekUsers[2] = Math.floor(Math.random() * listData.length) + 1;

        for (let i = 0; i < 3; i++) {
            const seekedUser = listData[seekUsers[i]];
            seekFields.push({
                name: `${seekedUser.username}`, value: `💦 ${seekedUser.stats.jerkStores}`// / 200`
            });
        }
    }

    const itemEmbed = new EmbedBuilder()
        .setTitle(`~ ${item.name} ~`)
        .setDescription('I found you some cum still in the balls sire...')
        .setFields(seekFields)
        .setThumbnail(`${item.img}`)

    let msg = interaction.update({
        embeds: [itemEmbed],
        components: []
    });
}