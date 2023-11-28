const { ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const jizzleTable = new AttachmentBuilder('C:/Programming/Discord Bots/DaveBot/bot/images/farkleTable.png');

const playJizzle = async (interaction) => {
  const user = interaction.user;
  let currBet = 0;

  const jizzleEmbed = new EmbedBuilder().setTitle(
    `🎲 Jizzle! 💦`
  )
  .setDescription(`Bet: Send your nut bet below!`)
  //.setImage('attachment://farkleTable.png')

  const newGameButton = new ButtonBuilder()
    .setCustomId("newGame")
    .setLabel("New Game")
    .setStyle(ButtonStyle.Primary);

  const optionsRow = new ActionRowBuilder().addComponents(newGameButton);

  const keep1Button = new ButtonBuilder()
    .setCustomId("keep1")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keep2Button = new ButtonBuilder()
    .setCustomId("keep2")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keep3Button = new ButtonBuilder()
    .setCustomId("keep3")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keepRow = new ActionRowBuilder()
    .addComponents(
        keep1Button,
        keep2Button,
        keep3Button
    )

    let msg = await interaction.reply({
        embeds: [jizzleEmbed],
        files: [jizzleTable],
        components: [optionsRow]
    })

  const jizzleBetFilter = (i) => {
    if (i.author.id === user.id && parseInt(i.content)) return true;
  };

  const jizzleBetCollector = interaction.channel.createMessageCollector({
    filter: jizzleBetFilter,
    time: 30000,
  });

  jizzleBetCollector.on("collect", async (i) => {
    currBet = Math.floor(parseInt(i.content));
    const jizzleEmbed = new EmbedBuilder().setTitle(
        `🎲 Jizzle! 💦`
      )
      .setDescription(`Bet: ${currBet} 💦`)
      .addFields(
        {name: '🎲', value: 's'}
      )
      //.setImage('attachment://farkleTable.png')

    let msg = await interaction.editReply({
        embeds: [jizzleEmbed],
        files: [jizzleTable],
        components: [keepRow]
    })
  });

  const jizzleButtonFilter = (i) => {
    return i.user.id === user.id;
  };
};

class Jizzle {
  constructor ({d1, d2, d3, state1, state2, state3}) {
    this.d1 = d1 ? Math.floor(Math.random() * 6) + 1 : d1;
    this.d2 = d2 ? Math.floor(Math.random() * 6) + 1 : d2;
    this.d3 = d3 ? Math.floor(Math.random() * 6) + 1 : d3;
    this.state1 = 'x';
  }
  score() {

  }
  data() {
    return {d1, d2, d3, state1, state2, state3}
  }
}

const runJizzle = () => {
  const d1 = Math.floor()
}

module.exports = playJizzle;