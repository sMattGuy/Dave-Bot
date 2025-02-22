const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { Users } = require('../../DB/functions/dbObjects.js');
const { makeTicket } = require('../../helper/keno_ticket.js');

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
        let hour_string = (currentDate.getHours()+1) % 12
        hour_string = hour_string==0?12:hour_string
        const attachment = await makeTicket(user.keno_numbers,currentDate.getDay(),currentDate.getMonth(),currentDate.getDate(),`${hour_string}o'clock`)
			  
        const ownedEmbed = new EmbedBuilder()
				  .setTitle(`Ticket Numbers for ${hour_string} o'clock!`)
				  .setDescription(`Your numbers are: ${user.keno_numbers}`);

			  await interaction.reply({ embeds: [ownedEmbed], files:[attachment], flags: MessageFlags.Ephemeral});
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
