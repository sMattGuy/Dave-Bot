const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dave')
		.setDescription("⏱ It's Dave o'clock somewhere! 🎉🎉"),
	async execute(interaction) {
        const crazyFunc = () => {
            return Math.floor((new Date() - 1615936548328) / (7 * 24 * 60 * 60 * 1000)) - 127;
        }
        console.log(crazyFunc())

        const daveEmbed = new EmbedBuilder()
            .setTitle(`⏱ ~${crazyFunc()} Weeks~ ⏱`)

		let msg = await interaction.reply({ embeds: [daveEmbed] });
	},
};