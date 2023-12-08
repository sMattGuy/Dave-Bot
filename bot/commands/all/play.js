const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const getUsers = require('../../../backend/firestore/main/getUsers');
const { playTopTimer } = require('../../helper/games/toptimer');
const playJizzle = require('../../helper/games/farkle');
const { playSlapjack } = require('../../helper/games/slapjack');

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
            .setDescription("Roll some dice and get jizzed on!")
            .addNumberOption(option =>
                option.setName('bet')
                    .setDescription('How much you wanna wager?')
                    .setRequired(true)),
                    )
        /*.addSubcommand((subcommand) =>
            subcommand
            .setName("slapjack")
            .setDescription("Slap it and jack it!")
            .addUserOption(option => 
                option.setName('opponent')
                    .setDescription("Who's the lucky lady?")
                    .setRequired(true)
                    )
            .addNumberOption(option =>
                option.setName('bet')
                    .setDescription('How much you wanna wager?')
                    .setRequired(true)),
                    )*/,
        
    
	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'jizzle') return await playJizzle(interaction);
        else if (interaction.options.getSubcommand() === 'slapjack') return await playSlapjack(interaction);
	},
};