const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { Users } = require('../../DB/functions/dbObjects.js');
const { Sequelize } = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karmaboard')
		.setDescription("Shows the most and least karmatic people!"),
	async execute(interaction) {
    const users = await Users.findAll({order: [['karma', 'DESC']]});
    const existing_karma = await Users.sum('karma');    

    const boardGoodEmbed = new EmbedBuilder()
      .setTitle(`The most Karmatic people are:`)
      .setDescription(`There is **${existing_karma} Karma** flowing through everyone...`)

    const boardBadEmbed = new EmbedBuilder()
      .setTitle(`The least Karmatic people are:`)

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

    interaction.reply({ embeds: [boardGoodEmbed, boardBadEmbed] });
	},
};
