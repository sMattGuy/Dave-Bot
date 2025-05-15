const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, MessageFlags} = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Dave Upvote')
    .setType(ApplicationCommandType.Message),
  async execute(interaction){
    const targetMessage = interaction.targetMessage;
    await targetMessage.react("<:DaveUpVote:1372713287996674060>");
    const reactionembed = new EmbedBuilder()
      .setTitle('Upvote Added!')
      .setDescription('Make sure you click the reaction too!');
    interaction.reply({embeds: [reactionembed], flags: MessageFlags.Ephemeral});
  }
}
