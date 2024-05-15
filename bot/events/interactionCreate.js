const { Events } = require('discord.js');
const { Fortunes } = require('../DB/functions/dbObjects.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if(interaction.isModalSubmit()){
			if(interaction.customId == 'newdotd'){
				const new_dotd = interaction.fields.getTextInputValue('wisdom');
				const username = interaction.user.username;
				await Fortunes.create({'text':new_dotd,'author':username});
				await interaction.reply({content: 'Your new DOTD has been saved!',ephemeral: true})
			}
			return;
		}
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};