const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const getUsers = require('../../../backend/firestore/main/getUsers');
const getUser = require('../../../backend/firestore/main/getUser');
const invCondenser = require('../../helper/inv_condenser');
const getItems = require('../../../backend/firestore/utility/get_items');
const convertNut = require('../../../backend/firestore/main/convertNut');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jerkme')
		.setDescription("🧑 Check the stat sheet! 😊"),
	async execute(interaction) {
        const user = interaction.user;
		let userData = await getUser(user);
        const itemsData = await getItems();
        //console.log(itemsData);

        let statsDesc = '';//`Nut Blocks: ${userData.stats.nutBlocks} 💦🧱\nNut: ${userData.stats.nut} 💦\nBalls: ${userData.stats.jerkStores}/200 💦`;
        if (userData.items?.foot_storage === 1) statsDesc += `\nLeft Foot: ${userData.stats.leftFootStores}/100`;
        if (userData.items?.foot_storage === 2) statsDesc += `\nRight Foot: ${userData.stats.rightFootStores}/100`;
        statsDesc += 'Clippy says: If you store more nut in the balls, you generate more nut more faster!';

        const shortInv = invCondenser(userData.items.backpack);

        let backpackText = 'Broke ahh 😔';

        if (userData.items.backpack.length > 0) backpackText = '';

        Object.keys(shortInv).forEach(item => {
            backpackText += `${itemsData[item].name} | Quantity: ${item}`
        });

        const statsEmbed = new EmbedBuilder()
            .setTitle('🥩 My Stuff 🧱')
			.setDescription(`${statsDesc}`)
            .addFields(
                { name: 'Nut Bricks', value: `🧱 ${userData.stats.nutBricks}`, inline: true },
                { name: 'Nut', value: `💦 ${userData.stats.nut}`, inline: true },
                { name: 'Balls', value: `💧 ${userData.stats.jerkStores}/200`, inline: true },
                { name: 'Daily Jerks Remaining', value: `${userData.stats.maxJerks - userData.stats.jerks}/${userData.stats.maxJerks}`},
                { name: 'Backpack', value: `${backpackText}`}
            );

        const convertNutButton = new ButtonBuilder()
            .setCustomId("convert")
            .setLabel("💦 Smelt Nut 🧱")
            .setStyle(ButtonStyle.Primary);

        if (userData.stats.nut < 1000) convertNutButton.setDisabled(true);

        const row1 = new ActionRowBuilder().addComponents(
            convertNutButton
        );

		let msg = await interaction.reply({
            embeds: [statsEmbed],
            components: [row1],
            ephemeral: true
        });

        const buttonFilter = (i) => {
            return i.user.id = user.id;
        }

        const buttonCollector = msg.createMessageComponentCollector({
            filter: buttonFilter,
            time: 10000
        });

        buttonCollector.on('collect', async i => {
            const choice = i.customId;
            if (choice === 'convert') {
                await convertNut(user);
                convertNutButton.setDisabled(true);
                userData = await getUser(user);
                const newStatsEmbed = new EmbedBuilder()
                    .setTitle('🥩 My Stuff 🧱')
                    .setDescription(`${statsDesc}`)
                    .addFields(
                        { name: 'Nut Bricks', value: `🧱  ${userData.stats.nutBricks}`, inline: true },
                        { name: 'Nut', value: `💦  ${userData.stats.nut}`, inline: true },
                        { name: 'Balls', value: `💧  ${userData.stats.jerkStores}/200`, inline: true },
                        { name: 'Daily Jerks Remaining', value: `${userData.stats.maxJerks - userData.stats.jerks}/${userData.stats.maxJerks}`},
                        { name: 'Backpack', value: `${backpackText}`}
                    );

                await i.update({
                    embeds: [newStatsEmbed],
                    components: [row1]
                });
                buttonCollector.stop('Button Clicked');
            }
        });

        buttonCollector.on('end', async (collected, reason) => {
            /*if (reason !== 'Button Clicked') {
            }*/
        });

	},
};