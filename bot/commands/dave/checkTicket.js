const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { Users } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkticket')
		.setDescription("Check your Karma Keno numbers!"),
	async execute(interaction) {
		let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10});
		}
    const currentDate = new Date()
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)
    
    const userKenoDate = new Date(user.keno_date)
    if(userKenoDate !== undefined){
      if(currentDate.getHours() == userKenoDate.getHours() && currentDate.getDate() == userKenoDate.getDate()){
			  const ownedEmbed = new EmbedBuilder()
				  .setTitle(`Ticket Numbers!`)
				  .setDescription(`Your numbers are: ${user.keno_numbers}`);

			  await interaction.reply({ embeds: [ownedEmbed], flags: MessageFlags.Ephemeral});
        return;
      }
    }
    const noTicketEmbed = new EmbedBuilder()
      .setTitle(`No Ticket`)
      .setDescription(`You do not own a ticket! Use /keno to purchase one!`);

    await interaction.reply({ embeds: [noTicketEmbed], flags: MessageFlags.Ephemeral});
    return;
	},
};
