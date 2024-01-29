const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const getUsers = require('../../../backend/firestore/main/getUsers');
const orderedJerk = require('../../../backend/firestore/helper/orderedJerk');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topjerk')
		.setDescription("🔨 Not your average Arby's 🥩"),
	async execute(interaction) {
		const usersData = await getUsers();
		const orderedJerkData = orderedJerk(usersData);

		const meatMaker = (amt) => {
			let meatText = '';
			for (let i = 0; i < amt; i++) {
				meatText += '🥩';
			}
			return meatText;
		}

		let meaterBoard = '';

		let counter = 1;
		orderedJerkData.forEach(user => {
			meaterBoard += `${counter}. ${user.username} ${meatMaker(user.stats.jerks)}\n`;
			counter++;
		})
		/*Object.keys(usersData).forEach((id) => {
			meaterBoard += `${counter}. ${usersData[id].username} ${meatMaker(usersData[id].stats.jerks)}\n`;
			counter++;
		})*/

        const meatLeaderboardEmbed = new EmbedBuilder()
            .setTitle('🔨 Meaterboard 🥩')
			.setDescription(`${meaterBoard ? meaterBoard : 'NOONE JERKIN??'}`);

		let msg = await interaction.reply({ embeds: [meatLeaderboardEmbed] });
	},
};