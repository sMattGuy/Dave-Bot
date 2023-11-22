const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const updateJerk = require('../../../backend/firestore/main/updateJerk');

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
        if (userData === 'Excessive Jerkin!') {
            const nomoJerkEmbed = new EmbedBuilder()
                .setTitle(`🤢 Excessive Jerkin! (Your tapped out dawg) 🤢`)

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
            'Baby killer.'
        ]

        const jerkAmt = userData.stats.jerks;

        const jerkEmbed = new EmbedBuilder()
            .setTitle(`🤢 You jerked ${jerkAmt} times today! ${jerkTextOptions[Math.floor(Math.random() * jerkTextOptions.length)]}`)
            .setDescription(`You extracted ${userData.stats.preNut} nut. Nice!`)

		let msg = await interaction.reply({ embeds: [jerkEmbed] });
	},
};