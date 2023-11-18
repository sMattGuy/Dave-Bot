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
        if (userData === 'Excessive Jerkin!') {
            const nomoJerkEmbed = new EmbedBuilder()
                .setTitle(`🤢 EXCESSIVE JERK ALERT 🤢`)
                .setDescription('lying ahh')

            return await interaction.reply({ embeds: [nomoJerkEmbed]});
        }

        const jerkTextOptions = [
            'wow...',
            "I bet you're not lonely!",
            "That's a start!",
            'Beats walkin!',
            'Gyatt!'
        ]

        const jerkAmt = userData.stats.dailyJerks;

        const jerkEmbed = new EmbedBuilder()
            .setTitle(`🤢 You jerked ${jerkAmt} times today! ${jerkTextOptions[Math.floor(Math.random() * 5)]}`)

		let msg = await interaction.reply({ embeds: [jerkEmbed] });
	},
};