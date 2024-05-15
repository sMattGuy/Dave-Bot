const { SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karma')
		.setDescription("Shows your current karma"),
	async execute(interaction) {
        let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10, last_fortune: Date.now()});
		}
		await interaction.reply({ content: `Current Karma: ${user.karma}`, ephemeral: true });
	},
};