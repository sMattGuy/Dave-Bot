const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { Users, Fortunes } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karma')
		.setDescription("Shows your current karma and stats!")
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
    const fortunes_authored = await Fortunes.count({where:{author_id:user_option.id}});
    
    const existing_karma = await Users.sum('karma');
    const user_count = await Users.count()
    const karma_average = Math.floor(existing_karma / user_count);
    let karma_standing = 'Karmatically Ambiguous';
    const user_karma_ratio = user.karma / karma_average;
    if(user_karma_ratio < 0.1){
      karma_standing = 'Doomed to the cycle';
    }
    else if(user_karma_ratio < 0.4){
      karma_standing = 'Novice Monk';
    }
    else if(user_karma_ratio < 0.7){
      karma_standing = 'Learned Monk';
    }
    else if(user_karma_ratio < 1.0){
      karma_standing = 'Disciplined Monk';
    }
    else if(user_karma_ratio < 1.3){
      karma_standing = 'Apprentice Monk';
    }
    else if(user_karma_ratio < 1.6){
      karma_standing = 'Journeyman Monk';
    }
    else if(user_karma_ratio < 1.9){
      karma_standing = 'Adept Monk';
    }
    else if(user_karma_ratio < 2.2){
      karma_standing = 'Leading Monk';
    }
    else if(user_karma_ratio < 2.5){
      karma_standing = 'Nobel Monk';
    }
    else if(user_karma_ratio < 2.8){
      karma_standing = 'Training Bodhisattva';
    }
    else if(user_karma_ratio < 3.1){
      karma_standing = 'Sotapanna';
    }
    else if(user_karma_ratio < 3.4){
      karma_standing = 'Sakadagami';
    }
    else if(user_karma_ratio < 3.7){
      karma_standing = 'Anagami';
    }
    else if(user_karma_ratio < 4.0){
      karma_standing = 'Arahant';
    }
    
    let karma_cost = Math.ceil(user.karma * .5) + 5 + Math.floor(Math.pow(1.5,fortunes_authored));

		const karmaEmbed = new EmbedBuilder()
			.setTitle(`${user_option.username} Karmatic Stats`)
      .setDescription(`Current Karma: ${user.karma}`)
      .addFields({name:`DOTD Authored`,value:`${fortunes_authored}`,inline:true},{name:'Create DOTD Cost',value:`${karma_cost} Karma`,inline: true},{name:`Karmatic Standing`,value:`${karma_standing}`})

		await interaction.reply({ embeds: [karmaEmbed] });
	},
};
