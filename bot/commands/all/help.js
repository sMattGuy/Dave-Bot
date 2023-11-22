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
                { name: '~JERK COMMANDS~', value: 'All things jerk are below.' },
                { name: '/jerk', value: 'Stroke that shii.' },
                { name: '/topJerk', value: 'Who been strokin the mostin?' },
                { name: '/jerkme', value: 'Check your stuff.' },
            )

		let msg = await interaction.reply({ embeds: [helpEmbed] });
	},
};