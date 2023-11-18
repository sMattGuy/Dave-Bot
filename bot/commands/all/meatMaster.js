const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const getUsers = require('../../../backend/firestore/main/getUsers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topjerk')
		.setDescription("🔨 Not your average Arby's 🥩"),
	async execute(interaction) {
		const usersData = await getUsers();

		const meatMaker = (amt) => {
			let meatText = '';
			for (let i = 0; i < amt; i++) {
				meatText += '🥩';
			}
			return meatText;
		}

		let meaterBoard = '';

		let counter = 1;
		Object.keys(usersData).forEach((id) => {
			meaterBoard += `${counter}. ${usersData[id].username} ${meatMaker(usersData[id].stats.dailyJerks)}`;
			counter++;
		})

        const meatLeaderboardEmbed = new EmbedBuilder()
            .setTitle('🔨 Meaterboard 🥩')
			.setDescription(`${meaterBoard}`);

		let msg = await interaction.reply({ embeds: [meatLeaderboardEmbed] });
	},
};