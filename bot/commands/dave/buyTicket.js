const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('keno')
		.setDescription("Buy a Karma Keno ticket for the hour! Costs 2 Karma."),
	async execute(interaction) {
		let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10});
		}
    if(user.karma < 2){
			const poorEmbed = new EmbedBuilder()
				.setTitle(`Not Enough Karma!`)
				.setDescription(`You cannot afford that ticket! You only have ${user.karma} Karma!`);

			await interaction.reply({ embeds: [poorEmbed], ephemeral: true});
      return
    }
    const currentDate = new Date()
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)
    
    const userKenoDate = new Date(user.keno_date)
    if(userKenoDate !== undefined){
      if(currentDate.getHours() == userKenoDate.getHours() && currentDate.getDate() == userKenoDate.getDate()){
			  const ownedEmbed = new EmbedBuilder()
				  .setTitle(`Ticket Owned!`)
				  .setDescription(`You already own a ticket! Use /checkticket to see it!`);

			  await interaction.reply({ embeds: [ownedEmbed], ephemeral: true});
        return;
      }
    }
    const picked_numbers = await generate_numbers();
    user.karma -= 2;
    user.keno_numbers = picked_numbers.toString();
    user.keno_date = currentDate.toString();
		await user.save();

    const successEmbed = new EmbedBuilder()
      .setTitle(`${interaction.user.displayName} bought a ${(currentDate.getHours()+1)%12} o'clock Karma Keno Ticket!`)
      .setDescription(`Your numbers are: ${picked_numbers.toString()}`);

    await interaction.reply({ embeds: [successEmbed] });
    return;
	},
};

async function generate_numbers(){
  let arr = [];
  while(arr.length < 10){
    let r = Math.floor(Math.random() * 80) + 1;
    if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}
