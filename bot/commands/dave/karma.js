const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { Users } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karma')
		.setDescription("Shows your current karma"),
	async execute(interaction) {
        let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10});
		}
		const karmaEmbed = new EmbedBuilder()
			.setTitle(`Current Karma`)
			.setDescription(`You currently have: ${user.karma} Karma`);

		await interaction.reply({ embeds: [karmaEmbed], flags: MessageFlags.Ephemeral});
	},
};
