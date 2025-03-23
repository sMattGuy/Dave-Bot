const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ohm")
    .setDescription("🙏 Who's not being zen right now? 🧘")
    .addUserOption(option =>
        option.setName('user')
        .setDescription('The offending party.')
        .setRequired(true)),
  async execute(interaction) {
      const ohmEmbed = new EmbedBuilder()
        .setColor(0x009c2c)
        .setTitle('🙏 OOOOOOOHHHHHHHMMMMMMM 🧘')
        .setDescription(`🧊😎 <@${interaction.user.id}> wants <@${interaction.options.getUser('user').id}> to chill out! 🍹⛱️`)

      let msg = await interaction.reply({ embeds: [ohmEmbed], withResponse: true });

      await msg.resource.message.react("👍");
      await msg.resource.message.react("👎");
  },
};
