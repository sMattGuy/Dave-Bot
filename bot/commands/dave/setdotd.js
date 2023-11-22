const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const updateDotd = require('../../../backend/firestore/main/dave/updateDotd');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setdotd')
		.setDescription("💬 Wut's the big message of the day David? 💬")
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Set the message of the day.')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.user;

		if (user.id == '534608357001265152' || user.id == '146113420498829313') {
			const newDotd = interaction.options.getString('message');

			await updateDotd(newDotd);
	
			const newDotdEmbed = new EmbedBuilder()
				.setTitle(`"${newDotd}" -Dave`)
	
			let msg = await interaction.reply({ embeds: [newDotdEmbed], ephemeral: true });
			return;
		}

		const badEmbed = new EmbedBuilder()
			.setTitle('❌ THATS FOR DAVE AND DAVE ONLY! ❌');

		await interaction.reply({ embeds: [badEmbed], ephemeral: true });

	},
};