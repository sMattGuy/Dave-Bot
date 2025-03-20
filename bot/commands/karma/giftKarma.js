const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, MessageFlags, AttachmentBuilder } = require("discord.js");
const { Users } = require('../../DB/functions/dbObjects.js');

const gift_image = `https://imgur.com/XEmxzvy.png`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giftkarma")
    .setDescription("Gift someone a little bit of your Karma!")
    .addUserOption(option =>
        option.setName('user')
        .setDescription('Who you want to give Karma to!')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount you want to give!')
        .setMinValue(1)
        .setRequired(true)),
  async execute(interaction) {
    let gift_getter_user = interaction.options.getUser('user');
    if(gift_getter_user.bot){
			const botEmbed = new EmbedBuilder()
				.setTitle(`Cant gift bots!`)
				.setDescription(`Bots already escaped Samsara!`);
!
			await interaction.reply({ embeds: [botEmbed], flags: MessageFlags.Ephemeral});
      return
    }
    if(interaction.user.id == gift_getter_user.id){
			const selfEmbed = new EmbedBuilder()
				.setTitle(`Cant gift yourself!`)
				.setDescription(`You cannot gift yourself!`);

			await interaction.reply({ embeds: [selfEmbed], flags: MessageFlags.Ephemeral});
      return
    }

		let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10});
		}

    const gift_amount = interaction.options.getInteger('amount');
    if(user.karma < gift_amount){
			const poorEmbed = new EmbedBuilder()
				.setTitle(`Not Enough Karma!`)
				.setDescription(`You cannot afford that gift! You only have ${user.karma} Karma!`);

			await interaction.reply({ embeds: [poorEmbed], flags: MessageFlags.Ephemeral});
      return
    }

		let gift_getter = await Users.findOne({where:{user_id: gift_getter_user.id}});
		if(!gift_getter){
			gift_getter = await Users.create({user_id: gift_getter_user.id, karma: 10});
		}

    user.karma -= gift_amount;
    gift_getter.karma += gift_amount;

    await user.save();
    await gift_getter.save();

    const giftEmbed = new EmbedBuilder()
      .setTitle(`${interaction.user.username} gifted ${gift_amount} Karma to ${gift_getter_user.username}`)
      .setImage(gift_image);

    await interaction.reply({ embeds: [giftEmbed]});
  },
};

