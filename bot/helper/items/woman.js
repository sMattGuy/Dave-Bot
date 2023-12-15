const { EmbedBuilder } = require("discord.js");

exports.woman = async (i, userData, item) => {
    const user = i.user;

    const itemEmbed = new EmbedBuilder()
        .setTitle(`~ ${item.name} ~`)
        .setDescription('I can distract the Nut Buster for you. 😉')
        .addFields(
            { name: 'Nut Protected: ', value: `💦 ${item.nutBlocked}`, inline: true},
            { name: 'Hired: ', value: `💦 ${item.active ? 'Yes': 'No'}`, inline: true}
        )
        .setThumbnail(`${item.img}`)

    let msg = await i.editReply({
        embeds: [ itemEmbed ],
        components: []
    });
}