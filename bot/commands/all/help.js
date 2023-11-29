const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('davehelp')
		.setDescription("Daddy Dave can has some wisdom to share."),
	async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle('Dave Help')
            .addFields(
                { name: '~DAVE COMMANDS~', value: 'All things Dave are below.' },
                { name: '/dave', value: 'See Daves time with us. (his days are numbered)' },
                { name: '/rateDave', value: 'Rate ya boy dave.' },
                { name: '/dotd', value: "Dave's message of the day." },
                { name: '/setdotd', value: "Dave can set his message of the day." },
                { name: '~JERK COMMANDS~', value: 'All things jerk are below.' },
                { name: '/jerk', value: 'Stroke that shii.' },
                { name: '/topjerk', value: 'Who been strokin the mostin?' },
                { name: '/jerkme', value: 'Check your stuff.' },
                { name: '/play', value: 'jizzle, slapjack(Cumming soon)' },
                { name: '/rules', value: 'jizzle, slapjack(Cumming soon)' },
            )

		let msg = await interaction.reply({ embeds: [helpEmbed] });
	},
};