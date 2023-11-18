const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('davehelp')
		.setDescription("Daddy Dave can has some wisdom to share."),
	async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle('Dave Help')
            .addFields(
                { name: '/dave' },
                { name: '/rateDave' },
                { name: '/jerk' },
                { name: '/topJerk' }
            )

		let msg = await interaction.reply({ embeds: [helpEmbed] });
	},
};