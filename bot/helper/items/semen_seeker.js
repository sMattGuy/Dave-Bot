const { EmbedBuilder } = require("discord.js");
const getUsers = require("../../../backend/firestore/main/getUsers");
const { updateSeek } = require("../../../backend/firestore/utility/update_seek");

exports.semenSeeker = async (i, userData, item) => {
    const user = i.user;
    const usersData = await getUsers();
    const listData = [];

    Object.keys(usersData).forEach(userId => {
        if (usersData[userId].stats.jerkStores >= 50 && userId !== userData.id) {
            listData.push(usersData[userId]);
        }
    });

    listData.sort((a, b) => b.stats.jerkStores - a.stats.jerkStores);

    let seekUsers = [];
    const seekFields = [];
    const seekedIdList = [];

    if (listData.length <= 3) {
        seekedIdList = Object.keys(listData);
    }
    else if (listData.length === 0) {
        const itemEmbed = new EmbedBuilder()
        .setTitle(`~ ${item.name} ~`)
        .setDescription('It appears there is no cum worth extracting right now sire...')
        .setFields()
        .setThumbnail(`${item.img}`)

    let msg = await i.editReply({
        embeds: [itemEmbed],
        components: []
    });
    return;
    }
    else {
        seekUsers[0] = Math.floor(Math.random() * listData.length);
        seekUsers[1] = Math.floor(Math.random() * listData.length);
        seekUsers[2] = Math.floor(Math.random() * listData.length);
        while (seekUsers[1] === seekUsers[0] || seekUsers[1] === seekUsers[2]) seekUsers[1] = Math.floor(Math.random() * listData.length);
        while (seekUsers[2] === seekUsers[0] || seekUsers[2] === seekUsers[1]) seekUsers[2] = Math.floor(Math.random() * listData.length);

        for (let i = 0; i < 3; i++) {
            const seekedUser = listData[seekUsers[i]];
            seekedIdList.push(seekedUser.id);
            seekFields.push({
                name: `${seekedUser.username}`, value: `💦 ${seekedUser.stats.jerkStores}`// / 200`
            });
        }
    }

    //seekedIdList[2] = '360557742642954262'; // testing
    await updateSeek(user, seekedIdList);

    const itemEmbed = new EmbedBuilder()
        .setTitle(`~ ${item.name} ~`)
        .setDescription('I found you some warm cum still in the balls sire...')
        .setFields(seekFields)
        .setThumbnail(`${item.img}`)

    let msg = await i.editReply({
        embeds: [itemEmbed],
        components: []
    });
}