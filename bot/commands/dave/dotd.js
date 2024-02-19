const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dotd')
		.setDescription("💬 Dave of the Day! 💬"),
	async execute(interaction) {
		const fortunes = fs.readFileSync(__dirname + '/fortunes.txt', 'utf-8');
		const fortunesArr = fortunes.split('\n');
		const fortuneCount = fortunesArr.length;
		const fortune = fortunesArr[Math.floor(Math.random() * fortuneCount)];

        const dotdEmbed = new EmbedBuilder()
			.setTitle(`${fortune}`);

		let msg = await interaction.reply({ embeds: [dotdEmbed] });
	},
};