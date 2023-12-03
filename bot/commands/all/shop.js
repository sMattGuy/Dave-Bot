const { EmbedBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const getUser = require("../../../backend/firestore/main/getUser");
const getTimers = require("../../../backend/firestore/utility/getTimers");
const getItems = require("../../../backend/firestore/utility/get_items");
const {
  getMerchant,
} = require("../../../backend/firestore/utility/get_merchant");
const { addItem } = require("../../../backend/firestore/utility/add_item");

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

    const leaveButton = new ButtonBuilder()
      .setCustomId('leave')
      .setLabel('Leave')
      .setStyle(ButtonStyle.Danger)

    const row2 = new ActionRowBuilder().addComponents(leaveButton);

    const shopEmbed = new EmbedBuilder()
      .setTitle(`~ Merchant ~\nYou have: 🧱 ${user.stats.nutBricks}`)
      .setDescription(
        `The Jizzler will arrive soon.\nThis is what I have in store right now  ...`
      )
      .setFields(shopFields);

    let msg = await interaction.reply({
      embeds: [shopEmbed],
      components: [row1, row2],
      ephemeral: true
    });

    const shopFilter = (i) => {
      return i.user.id === user.id;
    }

    const shopCollector = msg.createMessageComponentCollector({
      filter: shopFilter,
      idle: 90000,
    });

    shopCollector.on('collect', async (i) => {
      if (!i?.values?.[0] && i.customId === 'leave') {
        shopEmbed
          .setTitle('~ Merchant ~')
          .setDescription('👋 Cum again!')
          .setFields()

        await i.update({
          embeds: [shopEmbed],
          components: [],
        })

        shopCollector.stop('leave');
        return;
      }

      let itemId = i.values[0];
      if (user.stats.nutBricks >= itemsData[itemId].priceBase) {
        await addItem(user, itemId, itemsData[itemId].priceBase, 'nutBricks');

        shopEmbed
        .setTitle('~ Merchant ~')
        .setDescription('Thankyou for your purchase. Cum again!')
        .setFields(
          { name: '| Bill of Sale |', value: `${itemsData[itemId].name}` }
        )
        .setImage(`${itemsData[itemId].img}`)

        msg = await i.update({
          embeds: [shopEmbed],
          components: [],
        });

        shopCollector.stop();
      }
      else {
        shopEmbed
        .setTitle(`~ Merchant ~\nYou have: 🧱 ${user.stats.nutBricks}`)
        .setDescription(`You can't afford that brokie! Anything else?`)

        msg = await i.update({
          embeds: [shopEmbed],
          components: [row1, row2],
        });
      }
    })

    shopCollector.on('end', async (collected, reason) => {
      // idk yet
    });
  },
};