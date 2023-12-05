const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const getUsers = require("../../../backend/firestore/main/getUsers");
const { removeItem } = require("../../../backend/firestore/utility/remove_item");
const { updateSeek } = require("../../../backend/firestore/utility/update_seek");
const { updateNut } = require("../../../backend/firestore/main/update_nut");
const { updateBalls } = require("../../../backend/firestore/main/update_balls");
//const client = new Client({ intents: [GatewayIntentBits.Guilds] });

exports.nutBuster = async (i, userData, item) => {
    const user = i.user;
    const usersData = await getUsers();

    const seeked = userData.stats.lastSeek;
    const busterFields = [];

    const optionRow = new ActionRowBuilder()

    const itemEmbed = new EmbedBuilder()
        .setTitle(`~ ${item.name} ~`)
        .setThumbnail(`${item.img}`);

    if (seeked.length === 0) {
        itemEmbed.setDescription('You must use the Semen Seeker first to find some full balls!')
        return await i.editReply({
            embeds: [itemEmbed],
            components: []
        });
    }

    for (let i = 0; i < seeked.length; i++) {
        busterFields.push({
            name: `${usersData[seeked[i]].username}`, value: `💦 ${usersData[seeked[i]].stats.jerkStores}`
        });

        optionRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`${seeked[i]}`)
                .setLabel(`${usersData[seeked[i]].username}`)
                .setStyle(ButtonStyle.Success)
        )
    }

    itemEmbed
        .setDescription('Who do you want to bust?')
        .setFields(busterFields);

    let msg = await i.editReply({
        embeds: [itemEmbed],
        components: [optionRow]
    });

    const itemFilter = int => {
        return int.user.id === user.id;
    }

    const itemCollector = msg.createMessageComponentCollector({
        filter: itemFilter,
        time: 60000
    });

    itemCollector.on('collect', async (int) => {
        await removeItem(userData, item);
        const bustId = int.customId;
        const nutAmt = Math.floor(usersData[bustId].stats.jerkStores / item.levelStats.extractDivider[item.level - 1]);
        //await updateSeek(user, seeked.filter(id => id !== bustId));
        //await updateNut(user, nutAmt);
        //await updateBalls({id: bustId}, -nutAmt);
        itemEmbed
            .setDescription(`💦 🔦 You extracted 💦 ${nutAmt} from ${usersData[bustId].username}'s balls!
            \nYou now have 💦 ${userData.stats.nut + nutAmt}`)
            .setFields();
        await int.update({
            embeds: [itemEmbed],
            components: []
        });
        const dmEmbed = new EmbedBuilder()
            .setTitle(`😡 ${userData.username} extracted 💦 ${nutAmt} from your balls! 😡`)
        //const bustSnowflake = await client.users.fetch('146113420498829313');
        //console.log(bustSnowflake)
        //await bustSnowflake.send(bustSnowflake, { embeds: [dmEmbed] });
        itemCollector.stop();
    });

    itemCollector.on('end', async (collected, reason) => {

    });
}