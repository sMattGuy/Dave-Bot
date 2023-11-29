const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const getUsers = require('../../../backend/firestore/main/getUsers');
const { playTopTimer } = require('../../helper/games/toptimer');
const playJizzle = require('../../helper/games/farkle');
const farkleRules = require('../../helper/games/rules/farkle.json');
const slapjackRules = require('../../helper/games/rules/slapjack.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription("How you're gonna earn your nut!")
        .addSubcommand((subcommand) =>
            subcommand
            .setName("jizzle")
            .setDescription("Roll some dice and get jizzed on!"))
        .addSubcommand((subcommand) =>
            subcommand
            .setName("slapjack")
            .setDescription("More to cum...")),
    
	async execute(interaction) {
        const rulesEmbed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === 'jizzle') {
            rulesEmbed
                .setTitle(`${farkleRules.title}`)
                .setDescription(`${farkleRules.desc}`)
                .setFields(farkleRules.fields)
        }
        else if (interaction.options.getSubcommand() === 'slapjack') {
            rulesEmbed
                .setTitle(`${slapjackRules.title}`)
                .setDescription(`${slapjackRules.desc}`)
                .setFields(slapjackRules.fields)
        }

        await interaction.reply({
            embeds: [rulesEmbed]
        });
	},
};