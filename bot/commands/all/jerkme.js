const { EmbedBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const getUsers = require("../../../backend/firestore/main/getUsers");
const getUser = require("../../../backend/firestore/main/getUser");
const invCondenser = require("../../helper/inv_condenser");
const getItems = require("../../../backend/firestore/utility/get_items");
const convertNut = require("../../../backend/firestore/main/convertNut");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jerkme")
    .setDescription("🧑 Check the stat sheet! 😊"),
  async execute(interaction) {
    const user = interaction.user;
    let userData = await getUser(user);
    const itemsData = await getItems();
    //console.log(itemsData);

    let statsDesc = ""; //`Nut Blocks: ${userData.stats.nutBlocks} 💦🧱\nNut: ${userData.stats.nut} 💦\nBalls: ${userData.stats.jerkStores}/200 💦`;
    if (userData.items?.foot_storage === 1)
      statsDesc += `\nLeft Foot: ${userData.stats.leftFootStores}/100`;
    if (userData.items?.foot_storage === 2)
      statsDesc += `\nRight Foot: ${userData.stats.rightFootStores}/100`;
    statsDesc +=
      "Clippy says: If you store more nut in the balls, you generate more nut more faster!";

    const shortInv = invCondenser(userData.items.backpack);

    let backpackText = '';

    const itemSelect = new StringSelectMenuBuilder()
      .setCustomId("item")
      .setPlaceholder("Backpack");

    const row1 = new ActionRowBuilder().addComponents(itemSelect);

    Object.keys(shortInv).forEach((itemId) => {
      const item = itemsData[itemId];
      backpackText += `${item.name} | Quantity: ${shortInv[itemId]}`;
      itemSelect.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${item.name} - "${item.desc}"`)
          .setDescription(
            `Quantity: ${shortInv[itemId]} | Type: ${
              item.type === "consumable"
                ? "one-shot"
                : item.type === "upgrade"
                ? "upgrade"
                : "unknown"
            }`
          )
          .setValue(`${itemId}`)
      );
    });

    if (!backpackText) backpackText = "Broke ahh 😔";

    const statsEmbed = new EmbedBuilder()
      .setTitle("🥩 My Stuff 🧱")
      .setDescription(`${statsDesc}`)
      .addFields(
        {
          name: "Nut Bricks",
          value: `🧱 ${userData.stats.nutBricks}`,
          inline: true,
        },
        { name: "Nut", value: `💦 ${userData.stats.nut}`, inline: true },
        {
          name: "Balls",
          value: `💧 ${userData.stats.jerkStores}/200`,
          inline: true,
        },
        {
          name: "Daily Jerks Remaining",
          value: `${userData.stats.maxJerks - userData.stats.jerks}/${
            userData.stats.maxJerks
          }`,
        },
        { name: "Backpack", value: `${backpackText}` }
      );

    const convertNutButton = new ButtonBuilder()
      .setCustomId("convert")
      .setLabel("💦 Smelt Nut 🧱")
      .setStyle(ButtonStyle.Primary);

    if (userData.stats.nut < 1000) convertNutButton.setDisabled(true);

    const row2 = new ActionRowBuilder().addComponents(convertNutButton);

    let msg;

    if (userData.items.backpack.length > 0) {
      msg = await interaction.reply({
        embeds: [statsEmbed],
        components: [row1, row2],
        ephemeral: true,
      });
    } else {
      msg = await interaction.reply({
        embeds: [statsEmbed],
        components: [row2],
        ephemeral: true,
      });
    }

    const buttonFilter = (i) => {
      return (i.user.id = user.id);
    };

    const buttonCollector = msg.createMessageComponentCollector({
      filter: buttonFilter,
      time: 10000,
    });

    buttonCollector.on("collect", async (i) => {
      const choice = i.customId;
      if (choice === "convert") {
        await convertNut(user);
        convertNutButton.setDisabled(true);
        userData = await getUser(user);
        const newStatsEmbed = new EmbedBuilder()
          .setTitle("🥩 My Stuff 🧱")
          .setDescription(`${statsDesc}`)
          .addFields(
            {
              name: "Nut Bricks",
              value: `🧱  ${userData.stats.nutBricks}`,
              inline: true,
            },
            { name: "Nut", value: `💦  ${userData.stats.nut}`, inline: true },
            {
              name: "Balls",
              value: `💧  ${userData.stats.jerkStores}/200`,
              inline: true,
            },
            {
              name: "Daily Jerks Remaining",
              value: `${userData.stats.maxJerks - userData.stats.jerks}/${
                userData.stats.maxJerks
              }`,
            },
            { name: "Backpack", value: `${backpackText}` }
          );

        if (userData.items.backpack.length > 0) {
          backpackText = "";
          await i.update({
            embeds: [newStatsEmbed],
            components: [row1, row2],
            ephemeral: true,
          });
        } else {
          await i.update({
            embeds: [newStatsEmbed],
            components: [row2],
            ephemeral: true,
          });
        }

        buttonCollector.stop("Button Clicked");
      }
    });

    buttonCollector.on("end", async (collected, reason) => {
      /*if (reason !== 'Button Clicked') {
            }*/
    });
  },
};
