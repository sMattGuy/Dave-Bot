const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const getMatchData = require('../../helper/nycfc/getMatchData');
const getTeamStats = require('../../helper/nycfc/getTeamStats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nycfc')
		.setDescription("⚽ NYCFC team stats and tickets ⚽"),
	async execute(interaction) {
        const {pastMatches, upcomingMatches} = await getMatchData();
        /* Testing Logs
        console.log(pastMatches);
        console.log('--------------------------------------------------------------')
        console.log(upcomingMatches);
        */

        const nycFields = [];

        let inlineCount = 0;
        pastMatches.forEach(match => {
            if (inlineCount % 3) {
                //nycFields.push({ name: '\u200b', value: '\u200b' });
            }
            nycFields.push({
                name: `${match.home} | ${match.score[0]}\n${match.away} | ${match.score[1]}`,
                value: `${new Date(match.date).toDateString()}`,
                inline: true
            });
            inlineCount++;
        });

        const nycStats = await getTeamStats();
        //console.log(nycStats.fixtures.wins)

        nycFields.push({
            name: `⚽ NYCFC Stats 📜`,
            value: `Win: 69 | Loss: 69 | Draw: 69 | MVP: Dave`,
            //value: `Win: ${nycStats.fixtures.wins.total} | Loss: ${nycStats.fixtures.loses.total} | Draw: ${nycStats.fixtures.draws.total} | MVP: ???`,
            inline: false
        });

        nycFields.push({
            name: `The next home game is ${new Date(upcomingMatches.nextClosest.date).toDateString()}`,
            value: `${upcomingMatches.nextClosest.home} vs ${upcomingMatches.nextClosest.away} @ ${upcomingMatches.nextClosest.venue}`,
            inline: false
        });

        nycFields.push({
            name: `The next game is ${new Date(upcomingMatches.nextMatch.date).toDateString()}`,
            value: `${upcomingMatches.nextMatch.home} vs ${upcomingMatches.nextMatch.away} @ ${upcomingMatches.nextMatch.venue}`,
            inline: false
        });

        const findTixButton = new ButtonBuilder()
            .setCustomId('findtix')
            .setLabel('Find Tickets 🎫')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const row1 = new ActionRowBuilder()
            .addComponents(
                findTixButton
            );

        const nycfcEmbed = new EmbedBuilder()
            .setTitle(`🔵 🟠 NYCFC Stats ⚽ 🥅`)
            .setDescription('‼️ Dale New York ‼️')
            .setColor([159,210,255])
            .setThumbnail('https://i.imgur.com/F6nYggu.png')
            .setFields(nycFields)
            .setFooter({ text: 'Purchase tickets and see pricing below! [WORK IN PROGRESS]', iconURL: 'https://i.imgur.com/F6nYggu.png' })
            .setURL('https://www.newyorkcityfc.com/')

		let msg = await interaction.reply({ embeds: [nycfcEmbed], components: [row1] });
	},
};