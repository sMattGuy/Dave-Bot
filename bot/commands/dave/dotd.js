const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const getDotd = require('../../../backend/firestore/main/dave/getDotd');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dotd')
		.setDescription("💬 Dave of the Day! 💬"),
	async execute(interaction) {
        /*let dotd = await getDotd();

		if (!dotd) dotd = 'TELL THIS FUCKHEAD DAVE TO UPDATE THE DAVE OF THE DAY';*/

		const fortunes = fs.readFileSync(__dirname + '/fortunes.txt', 'utf-8');
		const fortunesArr = fortunes.split('\n');
		let fortuneCount = 0;
		fortunesArr.forEach(text => fortuneCount++);
		const fortune = fortunesArr[Math.floor(Math.random() * fortuneCount)];

        const dotdEmbed = new EmbedBuilder()
			.setTitle(`${fortune}`);
            //.setTitle(`"${dotd}" -Dave`)

		let msg = await interaction.reply({ embeds: [dotdEmbed] });
	},
};