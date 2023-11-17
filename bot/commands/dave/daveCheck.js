const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ratedave")
    .setDescription("🎉 Are we rockin wit Dave?? 🎉"),
  async execute(interaction) {
      const rateEmbed = new EmbedBuilder().setTitle("Do you rock wit Dave? 🧐");

      let msg = await interaction.reply({ embeds: [rateEmbed] });
      msg = await interaction.fetchReply();

      msg.react("👍");
      msg.react("👎");
      msg.react("🤷");
  },
};
