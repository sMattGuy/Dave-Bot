const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { Users } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spendkarma')
		.setDescription("Spend your karma to make a DOTD!"),
	async execute(interaction) {
        let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10});
		}
        if(user.karma < 10){
            const karmaEmbed = new EmbedBuilder()
			    .setTitle(`Not Enough Karma!`)
			    .setDescription(`You do not have enough Karma! You only have ${user.karma} Karma, but need 10 to create a DOTD!`);

		    await interaction.reply({ embeds: [karmaEmbed], ephemeral: true});
        }
        else{
            user.karma -= 10;
            await user.save();
            const modal = new ModalBuilder()
                    .setCustomId('newdotd')
                    .setTitle('Create a new DOTD!');
            const new_dotd = new TextInputBuilder()
                .setCustomId('wisdom')
                .setLabel('Type your DOTD here!')
                .setMaxLength(100)
                .setMinLength(1)
                .setPlaceholder('Type your wisdom here')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const actionRow = new ActionRowBuilder().addComponents(new_dotd);
            modal.addComponents(actionRow);
            await interaction.showModal(modal);
        }
	},
};
