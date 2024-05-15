const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const { Users, Fortunes } = require('../../DB/functions/dbObjects.js');
const { Sequelize } = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dotd')
		.setDescription("💬 Dave of the Day! 💬"),
	async execute(interaction) {
		const user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			Users.create({user_id: interaction.user.id, karma: 1, last_fortune: Date.now()});
		}
		else{
			if(user.last_fortune + 64800000 >= Date.now()){
				user.karma--;
			}
			else{
				user.karma++;
			}
			user.save();
		}
		const fortune = await Fortunes.findAll({order: Sequelize.literal('random()'), limit: 3});
		// process all 5 and pick one randomly
		let selection_array = [];
		for(sub_fortune in fortune){
			selection_array.push(fortune[sub_fortune]);
			for(let i=-5;i<sub_fortune.rating;i++){
				selection_array.push(sub_fortune);
			}
		}
		let selected_fortune = selection_array[Math.floor(Math.random()*selection_array.length)];
        const dotdEmbed = new EmbedBuilder()
			.setTitle(`${selected_fortune.text}`)
			.setDescription(`\\- ${selected_fortune.author}`);

		let msg = await interaction.reply({ embeds: [dotdEmbed], fetchReply: true });
		await msg.react("👍");
      	await msg.react("👎");
	},
};