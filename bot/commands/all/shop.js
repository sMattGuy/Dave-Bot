const { EmbedBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");
const getUser = require("../../../backend/firestore/main/getUser");
const getTimers = require("../../../backend/firestore/utility/getTimers");
const getItems = require("../../../backend/firestore/utility/get_items");
const {
  getMerchant,
} = require("../../../backend/firestore/utility/get_merchant");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Purchase items from the merchant!"),
  async execute(interaction) {
    const user = await getUser(interaction.user);
    const itemsData = await getItems();
    const merchantData = await getMerchant();
    const timersData = await getTimers();

    const shopFields = [];

    const itemSelect = new StringSelectMenuBuilder()
      .setCustomId("item")
      .setPlaceholder("What do you want to buy?");

    merchantData.shop.forEach((itemId) => {
      const item = itemsData[itemId];
      shopFields.push({
        name: `${item.name} - "${item.desc}"`,
        value: `Price: 🧱 ${item.priceBase}\nType: ${
          item.type === "consumable"
            ? "one-shot"
            : item.type === "upgrade"
            ? "upgrade"
            : "unknown"
        }`,
      });
      itemSelect.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${item.name} - "${item.desc}"`)
          .setDescription(
            `Price: 🧱 ${item.priceBase} | Type: ${
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

    const row1 = new ActionRowBuilder().addComponents(itemSelect);

    const shopEmbed = new EmbedBuilder()
      .setTitle("~ Merchant ~")
      .setDescription(
        `The Jizzler will arrive soon.\nThis is what I have in store right now  ...`
      )
      .setFields(shopFields);

    let msg = await interaction.reply({
      embeds: [shopEmbed],
      components: [row1],
    });
  },
};
