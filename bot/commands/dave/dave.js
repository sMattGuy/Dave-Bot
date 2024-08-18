const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dave')
		.setDescription("⏱ It's Dave o'clock somewhere! 🎉🎉"),
	async execute(interaction) {
		const uncountedWeeks = 127;
		const discordJoinDate = 1615680000000;
    const total_weeks = Math.floor((new Date() - discordJoinDate) / 604800000) - uncountedWeeks;
    const years = Math.floor(total_weeks/52);
    const weeks = total_weeks - (total_weeks * years);
    const year_word = (years == 1) ? "Year" : "Years";
    const week_word = (weeks == 1) ? "Week" : "Weeks";
    const daveEmbed = new EmbedBuilder()
        .setTitle(`⏱ ~${years} ${year_word}, ${weeks} ${week_word}~ ⏱`)

		let msg = await interaction.reply({ embeds: [daveEmbed] });
	},
};
