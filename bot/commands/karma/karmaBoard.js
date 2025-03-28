const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { Users, Fortunes } = require('../../DB/functions/dbObjects.js');
const { Sequelize, Op } = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karmaboard')
		.setDescription("Shows the most and least karmatic people!"),
	async execute(interaction) {
    const users = await Users.findAll({order: [['karma', 'DESC']]});
    const existing_karma = await Users.sum('karma',{where: { karma: { [Op.gte]: 0 } }});    
    
    const dotd_count = await Fortunes.findAll({group:['author_id'],attributes:['author_id',[Sequelize.fn('COUNT','author_id'),'authored_count']],order:[['authored_count','DESC']]});

    const top_authors = []
    for(i=0;i<dotd_count.length;i++){
      if(dotd_count[i].author_id == 0){
        continue;
      }
      else{
        top_authors.push([dotd_count[i].author_id,dotd_count[i].dataValues.authored_count])
      }
      if(top_authors.length >= 3){
        break;
      }
    }

    const boardGoodEmbed = new EmbedBuilder()
      .setColor(0x9c5b00)
      .setTitle(`The most Karmatic people are:`)
      .setDescription(`There is **${existing_karma} Karma** flowing through everyone...`)

    const boardBadEmbed = new EmbedBuilder()
      .setColor(0x47009c)
      .setTitle(`The least Karmatic people are:`)
    
    const authoredBoard = new EmbedBuilder()
      .setColor(0x009c2c)
      .setTitle(`Most DOTD's Authored:`)

    if(users.length > 0){
      let good_user = await interaction.client.users.fetch(users[0].user_id).catch(() => null);
      boardGoodEmbed.addFields({name: `1st. ${good_user!=null?good_user.username:'Mystery'}`, value: `${users[0].karma} Karma`, inline: true});
      
      let bad_user = await interaction.client.users.fetch(users[users.length - 1].user_id).catch(() => null);
      boardBadEmbed.addFields({name: `Worstest. ${bad_user!=null?bad_user.username:'Mystery'}`, value: `${users[users.length - 1].karma} Karma`, inline: true});

      if(users.length > 1){
        good_user = await interaction.client.users.fetch(users[1].user_id).catch(() => null);
        boardGoodEmbed.addFields({name: `2nd. ${good_user!=null?good_user.username:'Mystery'}`, value: `${users[1].karma} Karma`, inline: true});
        
        bad_user = await interaction.client.users.fetch(users[users.length - 2].user_id).catch(() => null);
        boardBadEmbed.addFields({name: `Worster. ${bad_user!=null?bad_user.username:'Mystery'}`, value: `${users[users.length - 2].karma} Karma`, inline: true});

        if(users.length > 2){
          good_user = await interaction.client.users.fetch(users[2].user_id).catch(() => null);
          boardGoodEmbed.addFields({name: `3rd. ${good_user!=null?good_user.username:'Mystery'}`, value: `${users[2].karma} Karma`, inline: true});
          
          bad_user = await interaction.client.users.fetch(users[users.length - 3].user_id).catch(() => null);
          boardBadEmbed.addFields({name: `Worst. ${bad_user!=null?bad_user.username:'Mystery'}`, value: `${users[users.length - 3].karma} Karma`, inline: true});
        }
        else{
          boardGoodEmbed.addFields({name: `3rd. No one!`, value: `0 Karma`, inline: true});
          boardBadEmbed.addFields({name: `Worst. No one!`, value: `0 Karma`, inline: true});
        }
      }
      else{
        boardGoodEmbed.addFields({name: `2nd. No one!`, value: `0 Karma`, inline: true});
        boardBadEmbed.addFields({name: `Worster. No one!`, value: `0 Karma`, inline: true});
        boardGoodEmbed.addFields({name: `3rd. No one!`, value: `0 Karma`, inline: true});
        boardBadEmbed.addFields({name: `Worst. No one!`, value: `0 Karma`, inline: true});
      }
    }
    else{
      boardGoodEmbed.addDescription(`No one has any karma yet!`);
      boardBadEmbed.addDescription(`No one has any karma yet!`);
    }

    if(top_authors.length >= 3){
      let first_author = await interaction.client.users.fetch(top_authors[0][0]).catch(() => null);
      authoredBoard.addFields({name: `1st. ${first_author!=null?first_author.username:'Mystery'}`, value: `${top_authors[0][1]} ${top_authors[0][1]==1?'DOTD':'DOTD\'s'}`, inline: true});
      let second_author = await interaction.client.users.fetch(top_authors[1][0]).catch(() => null);
      authoredBoard.addFields({name: `2nd. ${second_author!=null?second_author.username:'Mystery'}`, value: `${top_authors[1][1]} ${top_authors[1][1]==1?'DOTD':'DOTD\'s'}`, inline: true});
      let third_author = await interaction.client.users.fetch(top_authors[2][0]).catch(() => null);
      authoredBoard.addFields({name: `3rd. ${third_author!=null?third_author.username:'Mystery'}`, value: `${top_authors[2][1]} ${top_authors[2][1]==1?'DOTD':'DOTD\'s'}`, inline: true});
    }
    else{
      authoredBoard.addDescription(`Not enough authored DOTD's have been made!`);
    }

    interaction.reply({ embeds: [boardGoodEmbed, boardBadEmbed, authoredBoard] });
	},
};
