const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { Channels } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setmessagechannel')
		.setDescription("Sets this channel as the Dave channel where he will talk")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
    const saved_channel = await Channels.findOne({where:{server_id: interaction.guildId}});
    if(!saved_channel){
      // channel doesnt exist, add new one
      await Channels.create({server_id: interaction.guildId, channel_id: interaction.channelId});
      interaction.reply({content:'Channel has been updated!',flags: MessageFlags.Ephemeral});
    }
    else{
      saved_channel.channel_id = interaction.channelId;
      await saved_channel.save();
      interaction.reply({content:'Channel has been updated!',flags: MessageFlags.Ephemeral});
    }
	},
};
