const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lame")
    .setDescription("😒 Visit the Hall of Lame 🎫"),
  async execute(interaction) {
      const hallEmoji = new EmbedBuilder()
        .setTitle('🏛️ The Hall of Lame 🏛️')
        .setDescription('💯🎈 GRAND OPENING 💯🎈')
        .addFields(
          { name: 'Nectario "Tosh" Toshi', value: 'Some thought him cool, others thought him fool.' },
          { name: 'Turan "The Racist" Turkishname', value: 'Untimely "jokes" lead to a timely death.' },
          { name: 'Michael "Spike" Valenzoola', value: 'Although they were warned, it was a tranny that sealed his fate.' },
          { name: 'Dean "Tech Support" Pektas and Julia "SAVAGE" Montesdoca', value: 'Lies, deceit, gaslighting, and the ambulance incident was their claim to lame.' },
          { name: 'Owen "Glass Bones"', value: 'Suffering from paper skin and glass bones, too easy to troll, and so death took its toll.' },
          { name: '❗ Vistor Notice ❗', value: 'In an effort to preserve the health of "The Cord",\nsome ex-friends have not been added to the Hall of Lame.\nThankyou, please enjoy your visit.'}
        )

      let msg = await interaction.reply({ embeds: [hallEmoji] });
  },
};