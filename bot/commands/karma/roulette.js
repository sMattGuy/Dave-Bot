const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { Users } = require('../../DB/functions/dbObjects.js');
const { makeTable } = require('../../helper/roulette_table.js');

// -1 is 00
const single_wins = [[-1],[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24],[25],[26],[27],[28],[29],[30],[31],[32],[33],[34],[35],[36]]

const double_wins = [[-1,0],[1,2],[2,3],[4,5],[5,6],[7,8],[8,9],[10,11],[11,12],[13,14],[14,15],[16,17],[17,18],[19,20],[20,21],[22,23],[23,24],[25,26],[26,27],[28,29],[29,30],[31,32],[32,33],[34,35],[35,36],[1,4],[2,5],[3,6],[4,7],[5,8],[6,9],[7,10],[8,11],[9,12],[10,13],[11,14],[12,15],[13,16],[14,17],[15,18],[16,19],[17,20],[18,21],[19,22],[20,23],[21,24],[22,25],[23,26],[24,27],[25,28],[26,29],[27,30],[28,31],[29,32],[30,33],[31,34],[32,35],[33,36]];

const three_wins = [[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20,21],[22,23,24],[25,26,27],[28,29,30],[31,32,33],[34,35,36]];

const four_wins = [[1,2,4,5],[2,3,5,6],[4,5,7,8],[5,6,8,9],[7,8,10,11],[8,9,11,12],[10,11,13,14],[11,12,14,15],[13,14,16,17],[14,15,17,18],[16,17,19,20],[17,18,20,21],[19,20,22,23],[20,21,23,24],[22,23,25,26],[23,24,26,27],[25,26,28,29],[26,27,29,30],[28,29,31,32],[29,30,32,33],[31,32,34,35],[32,33,35,36]];

const five_wins = [[-1,0,1,2,3]];

const six_wins = [[1,2,3,4,5,6],[4,5,6,7,8,9],[7,8,9,10,11,12],[10,11,12,13,14,15],[13,14,15,16,17,18],[16,17,18,19,20,21],[19,20,21,22,23,24],[22,23,24,25,26,27],[25,26,27,28,29,30],[28,29,30,31,32,33],[31,32,33,34,35,36]];

const twelve_wins = [[1,2,3,4,5,6,7,8,9,10,11,12],[13,14,15,16,17,18,19,20,21,22,23,24],[25,26,27,28,29,30,31,32,33,34,35,36]];

const column_win = [[1,4,7,10,13,16,19,22,25,28,31,34],[2,5,8,11,14,17,20,23,26,29,32,35],[3,6,9,12,15,18,21,24,27,30,33,36]];

const first18_win = [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]];
const last18_win = [[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]];

const redblack_win = [[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],[2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]];

const oddeven_win = [[1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35],[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36]];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription("Lets you test your luck for 2 Karma!")
    .addStringOption(option => 
      option.setName('bet')
        .setDescription('The type of bet you want to place!')
        .setRequired(true)
        .addChoices(
          {name:'Single Number (35:1)',value:'single'},
          {name:'Double Number (17:1)',value:'double'},
          {name:'Three Number (11:1)',value:'three'},
          {name:'Four Number (8:1)',value:'four'},
          {name:'Five Number (6:1)',value:'five'},
          {name:'Six Number (5:1)',value:'six'},
          {name:'Twelve Number (2:1)',value:'twelve'},
          {name:'Column (2:1)',value:'column'},
          {name:'First 18 (1:1)',value:'first18'},
          {name:'Last 18 (1:1)',value:'last18'},
          {name:'Red/Black (1:1)',value:'redblack'},
          {name:'Odd/Even (1:1)',value:'oddeven'},
        ))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount you want to bet!')
        .setMinValue(2)
        .setRequired(true)),
	async execute(interaction) {
    const bet_type_array_match = {
      'single':single_wins,
      'double':double_wins,
      'three':three_wins,
      'four':four_wins,
      'five':five_wins,
      'six':six_wins,
      'twelve':twelve_wins,
      'column':column_win,
      'first18':first18_win,
      'last18':last18_win,
      'redblack':redblack_win,
      'oddeven':oddeven_win
    };
    const bet_mult_array_match = {
      'single':35,
      'double':17,
      'three':11,
      'four':8,
      'five':6,
      'six':5,
      'twelve':2,
      'column':2,
      'first18':1,
      'last18':1,
      'redblack':1,
      'oddeven':1
    };
		let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 10});
		}
		const bet_type = interaction.options.getString('bet');
		const bet_amount = interaction.options.getInteger('amount');
    if(user.karma < bet_amount){
			const poorEmbed = new EmbedBuilder()
				.setTitle(`Not Enough Karma!`)
				.setDescription(`You cannot afford that bet! You only have ${user.karma} Karma!`);

			await interaction.reply({ embeds: [poorEmbed], flags: MessageFlags.Ephemeral});
      return
    }
    
    user.karma -= bet_amount;

    let bet_type_array = bet_type_array_match[bet_type];
    let user_numbers_choice = bet_type_array[Math.floor(Math.random() * bet_type_array.length)];
    
    let roulette_number = randomBetween(-1,36);

    let table_picture = await makeTable(user_numbers_choice,roulette_number);

    if(user_numbers_choice.includes(roulette_number)){
      user.karma += (bet_amount * bet_mult_array_match[bet_type]) + bet_amount;
			const winEmbed = new EmbedBuilder()
				.setTitle(`Your bet hits!`)
				.setDescription(`Dave picked the numbers ${user_numbers_choice} for you, and ${roulette_number} hit! You won ${bet_amount * bet_mult_array_match[bet_type]} Karma!`);
      await user.save();
			await interaction.reply({ files: [table_picture], embeds: [winEmbed] });
      return
    }
    else{
			const loseEmbed = new EmbedBuilder()
				.setTitle(`Your bet fails!`)
				.setDescription(`Dave picked the numbers ${user_numbers_choice} for you, and the machine hit ${roulette_number}! Better luck next time!`);
      await user.save();
			await interaction.reply({ files: [table_picture], embeds: [loseEmbed] });
      return
    }
	},
};

function randomBetween(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}
