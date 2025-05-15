const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, MessageFlags} = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Dave Downvote')
    .setType(ApplicationCommandType.Message),
  async execute(interaction){
    const targetMessage = interaction.targetMessage;
    await targetMessage.react("<:DaveDownVote:1372713300189774026>");
    const reactionembed = new EmbedBuilder()
      .setTitle('Downvote Added!')
      .setDescription('Make sure you click the reaction too!');
    interaction.reply({embeds: [reactionembed], flags: MessageFlags.Ephemeral});
  }
}
