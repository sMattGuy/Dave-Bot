const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { Users, Fortunes } = require('../../DB/functions/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spendkarma')
		.setDescription("Spend your karma to make a DOTD!"),
	async execute(interaction) {
    let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10});
		}
    let authored_count = await Fortunes.count({where:{author_id: interaction.user.id}});
    let karma_cost = Math.ceil(user.karma * .5) + 5 + Math.floor(Math.pow(1.5,authored_count));
    if(user.karma < karma_cost){
      const karmaEmbed = new EmbedBuilder()
        .setColor(0x47009c)
        .setTitle(`Not Enough Karma!`)
        .setDescription(`You do not have enough Karma! You only have ${user.karma} Karma, but need ${karma_cost} Karma to create a DOTD!`);
      await interaction.reply({ embeds: [karmaEmbed], flags: MessageFlags.Ephemeral});
    }
    else{
      const modal = new ModalBuilder()
        .setCustomId('newdotdsp')
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
