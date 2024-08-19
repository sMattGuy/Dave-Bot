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
    if(years == 0 && weeks == 0){
      daveEmbed.setTitle(`⏱ ~He just got here!~ ⏱`)
    }
    else if(years == 0){
      daveEmbed.setTitle(`⏱ ~${weeks} ${week_word}~ ⏱`)  
    }
    else if(weeks == 0){
      daveEmbed.setTitle(`⏱ ~${years} ${year_word}~ ⏱`)
    }
    else{
      daveEmbed.setTitle(`⏱ ~${years} ${year_word}, ${weeks} ${week_word}~ ⏱`)
    }
		let msg = await interaction.reply({ embeds: [daveEmbed] });
	},
};
