const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { Users } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karma')
		.setDescription("Shows your current karma")
    .addUserOption(option => 
      option.setName('user')
      .setDescription('Optionally check anothers user')
      .setRequired(false)
    ),
	async execute(interaction) {
    let user_option = interaction.options.getUser('user') ?? interaction.user;
    if(user_option.bot){
      const errorEmbed = new EmbedBuilder()
        .setTitle(`Bots have already escaped Samsara!`)
		  return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral});
    }
    let user = await Users.findOne({where:{user_id: user_option.id}});
		if(!user){
			user = await Users.create({user_id: user_option.id, karma: 10});
		}
		const karmaEmbed = new EmbedBuilder()
			.setTitle(`Current Karma for ${user_option.username}: ${user.karma} Karma`)

		await interaction.reply({ embeds: [karmaEmbed], flags: MessageFlags.Ephemeral});
	},
};
