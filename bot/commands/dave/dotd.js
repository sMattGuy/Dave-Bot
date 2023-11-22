const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const getDotd = require('../../../backend/firestore/main/dave/getDotd');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dotd')
		.setDescription("💬 Dave of the Day! 💬"),
	async execute(interaction) {
        let dotd = await getDotd();
		
		if (!dotd) dotd = 'TELL THIS FUCKHEAD DAVE TO UPDATE THE DAVE OF THE DAY';

        const dotdEmbed = new EmbedBuilder()
            .setTitle(`"${dotd}" -Dave`)

		let msg = await interaction.reply({ embeds: [dotdEmbed] });
	},
};