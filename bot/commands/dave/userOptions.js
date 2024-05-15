const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Users } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('useroptions')
		.setDescription("Modify a users data")
		.addUserOption(option => 
			option.setName('user')
				.setDescription('The user to modify')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('topic')
				.setDescription('The value to modify')
				.addChoices(
					{name: 'Karma',value:'karma'},
					{name: 'Last Fortune',value:'last'},
				)
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('value')
				.setDescription('The new value')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const userobj = interaction.options.getUser('user');
		const topic = interaction.options.getString('topic');
		const value = interaction.options.getInteger('value');

		let user = await Users.findOne({where:{user_id: userobj.id}});
		if(!user){
			user = await Users.create({user_id: userobj.id, karma: 10});
		}

		if(topic == 'karma'){
			user.karma = value;
			interaction.reply({content:`karma set to ${value}`,ephemeral:true})
		}
		else if(topic == 'last'){
			user.last_fortune = value;
			interaction.reply({content:`last fortune set yo ${value}`,ephemeral:true})
		}
		else{
			interaction.reply({content:`something went wrong`,ephemeral:true})
		}
		await user.save();
	},
};
