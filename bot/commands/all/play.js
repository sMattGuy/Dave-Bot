const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const getUsers = require('../../../backend/firestore/main/getUsers');
const { playTopTimer } = require('../../helper/games/toptimer');
const playJizzle = require('../../helper/games/farkle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription("Beat off and have fun!")
        /*.addSubcommand((subcommand) =>
            subcommand
            .setName("toptimer")
            .setDescription("Time the top and get jizzed on!"))*/
        .addSubcommand((subcommand) =>
            subcommand
            .setName("jizzle")
            .setDescription("Roll some dice and get jizzed on!")),
    
	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'jizzle') return await playJizzle(interaction);
        switch (interaction.options.getSubcommand()) {
            case 'toptimer':
                await playTopTimer(interaction);
                break;
            case 'jizzle':
                await playJizzle(interaction);
                break;
        
            default:
                break;
        }
	},
};