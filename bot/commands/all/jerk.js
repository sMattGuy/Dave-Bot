const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const updateJerk = require('../../../backend/firestore/main/updateJerk');
const { magicLotion } = require('../../helper/JerkEvents/magicLotion');
const { massagee } = require('../../helper/JerkEvents/massagee');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jerk')
		.setDescription("🍆💦 Update your daily jerks! 🍆💦"),
	async execute(interaction) {
        const user = interaction.user;
        const userData = await updateJerk(user);
        if (userData === 'no user') {
            const noUserEmbed = new EmbedBuilder()
                .setTitle(`Try /jerkme first!`)

            return await interaction.reply({ embeds: [noUserEmbed], ephemeral: true });
        }
        if (userData === 'max jerks') {
            const nomoJerkEmbed = new EmbedBuilder()
                .setTitle(`🤢 Excessive Jerkin! (You tapped out dawg) 🤢`)

            return await interaction.reply({ embeds: [nomoJerkEmbed]});
        }

        const jerkTextOptions = [
            'wow...',
            "I bet you're not lonely!",
            "That's a start!",
            'Beats walkin!',
            'Gyatt!',
            'Better me than you.',
            'Tis better to sink in the cum, than to cum in the sink.',
            'Baby killer.',
            "OMG it's everywhere!",
            'uWu',
            'Notice me creampai',
            'Uh oh, mom is watching!',
            'Just strokin yo shii',
            'Your parents must be so proud :)'
        ]

        const jerkAmt = userData.stats.jerks;
        let msg;

        const jerkEmbed = new EmbedBuilder()
            .setTitle(`🤢 You jerked ${jerkAmt} times today! ${jerkTextOptions[Math.floor(Math.random() * jerkTextOptions.length)]}`)

        const jerkEventChance = 1;
        const events = [
            magicLotion,
            massagee,
        ]

        if (Math.floor(Math.random() * 10) + 1 <= jerkEventChance) {
            const event = events[Math.floor(Math.random() * events.length)];
            const { title } = await event();
            jerkEmbed.setTitle(`${title}`);

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept')
                .setLabel('Sure')
                .setStyle(ButtonStyle.Primary)

            const declineButton = new ButtonBuilder()
                .setCustomId('decline')
                .setLabel('No Thanks')
                .setStyle(ButtonStyle.Danger)

            const optionsRow = new ActionRowBuilder().addComponents(acceptButton, declineButton);

            msg = await interaction.reply({
                embeds: [jerkEmbed],
                components: [optionsRow]
            });

            const jerkFilter = i => {
                return i.user.id === user.id;
            }

            const jerkCollector = msg.createMessageComponentCollector({
                filter: jerkFilter,
                time: 60000
            });

            jerkCollector.on('collect', async i => {
                const choice = i.customId;
                if (choice === 'accept') {
                    jerkCollector.stop('accepted');
                    const { resTitle, resDesc } = await event(true, user);
                    jerkEmbed.setTitle(`${resTitle}`).setDescription(`${resDesc}`);

                    msg = await i.update({
                        embeds: [jerkEmbed],
                        components: []
                    });
                    return;
                }
                jerkCollector.stop();
            });
            jerkCollector.on('end', async (collected, reason) => {
                if (reason !== 'accepted') {
                    jerkEmbed.setTitle(`🤢 You jerked ${jerkAmt} times today! ${jerkTextOptions[Math.floor(Math.random() * jerkTextOptions.length)]}`).setDescription(`You extracted ${userData.stats.preNut} nut. Nice!`)
                    msg = await interaction.editReply({ embeds: [jerkEmbed], components: [] });
                }
            });
        }
        else {
            jerkEmbed.setDescription(`You extracted ${userData.stats.preNut} nut. Nice!`)
            msg = await interaction.reply({ embeds: [jerkEmbed] });
        }
	},
};