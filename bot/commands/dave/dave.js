const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dave')
		.setDescription("⏱ It's Dave o'clock somewhere! 🎉🎉"),
	async execute(interaction) {
		const uncountedWeeks = 127;
		const discordJoinDate = 1615936548328;

        const crazyFunc = () => {
            return Math.floor((new Date() - discordJoinDate) / (7 * 24 * 60 * 60 * 1000)) - uncountedWeeks;
        }

        const daveEmbed = new EmbedBuilder()
            .setTitle(`⏱ ~${crazyFunc()} Weeks~ ⏱`)

		let msg = await interaction.reply({ embeds: [daveEmbed] });
	},
};