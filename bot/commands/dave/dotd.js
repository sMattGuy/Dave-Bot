const { EmbedBuilder } = require('@discordjs/builders');
const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { Users, Fortunes } = require('../../DB/functions/dbObjects.js');
const { Sequelize } = require('sequelize');
const { makeTicket } = require('../../helper/keno_ticket.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dotd')
		.setDescription("💬 Dave of the Day! 💬"),
	async execute(interaction) {
		let user = await Users.findOne({where:{user_id: interaction.user.id}});
		if(!user){
			user = await Users.create({user_id: interaction.user.id, karma: 11, last_fortune: Date.now()});
		}
	  
    const penalty_time = 14400000;

    if(user.last_fortune + penalty_time >= Date.now()){
      if(!user.karma_penalty){
        user.karma_penalty = 0;
        await user.save();
      }
      let karma_penalty = user.karma_penalty;
      if(karma_penalty == 0){
        karma_penalty = -2;
      }
      else{
        karma_penalty *= 2;
      }
      
      const timeleft = (user.last_fortune + penalty_time) - Date.now();
      const secsLeft = Math.floor((timeleft/1000)%60)
      const minsLeft = Math.floor((timeleft/(1000*60))%60)
      const hoursLeft = Math.floor((timeleft/(1000*60*60))%24);

      const confirm_button = new ButtonBuilder()
        .setCustomId('confirmdotd')
        .setLabel('Take Penalty')
        .setStyle(ButtonStyle.Danger);

      const cancel_button = new ButtonBuilder()
        .setCustomId('canceldotd')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

      const penalty_row = new ActionRowBuilder()
        .addComponents(confirm_button, cancel_button);
      
      const penaltyEmbed = new EmbedBuilder()
        .setColor(0x47009c)
        .setTitle(`Karma Penalty will be applied!`)
        .setDescription(`Using a DOTD now will incur a ${karma_penalty} Karma Penalty! Are you sure you want to accept another DOTD? Your next penalty free DOTD is in ${hoursLeft.toString().padStart(2,'0')}:${minsLeft.toString().padStart(2,'0')}:${secsLeft.toString().padStart(2,'0')}`);

      const response = await interaction.reply({embeds: [penaltyEmbed], components: [penalty_row], flags: MessageFlags.Ephemeral, withResponse: true});
      
      const collectorFilter = i => i.user.id === interaction.user.id;

      try {
        const confirmation = await response.resource.message.awaitMessageComponent({filter: collectorFilter, time: 60_000});
        if(confirmation.customId === 'confirmdotd'){
          const acceptEmbed = new EmbedBuilder()
            .setColor(0x47009c)
            .setTitle(`Penalty Accepted`)
            .setDescription(`So be it.`);
          await interaction.editReply({embeds: [acceptEmbed], components: []})
		      user = await Users.findOne({where:{user_id: interaction.user.id}});
          user.karma_penalty = karma_penalty;
          user.karma += karma_penalty;
          if(user.karma < -100000){
            user.karma = -100000;
          }
          user.last_fortune += Math.floor(penalty_time/2);
          await user.save();
          await displayDOTD(true);
          await generateTicket();
        }
        else{
          const timeoutEmbed = new EmbedBuilder()
            .setColor(0x47009c)
            .setTitle(`DOTD ignored...`)
            .setDescription(`Come back later for a DOTD.`);
          await interaction.editReply({embeds: [timeoutEmbed], components: []})
        }
      } catch(error) {
          console.error(error);
          const timeoutEmbed = new EmbedBuilder()
            .setColor(0x47009c)
            .setTitle(`DOTD ignored...`)
            .setDescription(`Come back later for a DOTD.`);
          await interaction.editReply({embeds: [timeoutEmbed], components: []})
      }
    }
    else{
      user.karma++;
      user.karma_penalty = 0;
      user.last_fortune = Date.now();
      await user.save();
      if(Math.random() < 0.001 && user.karma > 0){
        createDOTD();
      }
      else{
        await displayDOTD(false);
        await generateTicket();
      }
    }
    
    // actual functions for showing results
    async function displayDOTD(followup){
			const fortune = await Fortunes.findAll({order: Sequelize.literal('random()'), limit: 3});
			// process all 5 and pick one randomly
			let selection_array = [];
			for(sub_fortune in fortune){
				selection_array.push(fortune[sub_fortune]);
				for(let i=-5;i<sub_fortune.rating;i++){
					selection_array.push(sub_fortune);
          if(i > 20){
            break;
          }
				}
			}
			let selected_fortune = selection_array[Math.floor(Math.random()*selection_array.length)];
			const dotdEmbed = new EmbedBuilder()
        .setColor(0x9c5b00)
				.setTitle(`#${selected_fortune.id}: "${selected_fortune.text}"`)
				.setDescription(`\\- ${selected_fortune.author}`)
        .setFooter({text:`Fortune Rating: ${selected_fortune.rating}`});
      
			let msg = ""
      if(followup){
        msg = await interaction.followUp({ embeds: [dotdEmbed] });
      }
      else{
        msg = await interaction.reply({ embeds: [dotdEmbed], withResponse: true });
        await msg.resource.message.react("👍");
        await msg.resource.message.react("👎");
      }
      let authored_count = await Fortunes.count({where:{author_id: interaction.user.id}});
      let karma_cost = Math.ceil(user.karma * .5) + 5 + Math.floor(Math.pow(1.5,authored_count));
      if(user.karma >= karma_cost){
        const karmaEmbed = new EmbedBuilder()
          .setColor(0x009c2c)
					.setTitle(`You have enough Karma to make a DOTD!`)
					.setDescription(`You currently have ${user.karma} karma! Use /spendkarma to use ${karma_cost} to create a DOTD!`);
				await interaction.followUp({embeds: [karmaEmbed], flags: MessageFlags.Ephemeral});
			}
    }
    async function createDOTD(){
      const modal = new ModalBuilder()
        .setCustomId('newdotd')
        .setTitle('Dave has chosen you to create a DOTD!');
      const new_dotd = new TextInputBuilder()
        .setCustomId('wisdom')
        .setLabel('Type your DOTD here!')
        .setMaxLength(100)
        .setMinLength(1)
        .setPlaceholder('Type your wisdom here')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
      const actionRow = new ActionRowBuilder().addComponents(new_dotd);
      modal.addComponents(actionRow);
      await interaction.showModal(modal);
    }
    async function generateTicket(){
      const currentDate = new Date()
      currentDate.setMinutes(0)
      currentDate.setSeconds(0)
      currentDate.setMilliseconds(0)
      const userKenoDate = new Date(user.keno_date)
      if(userKenoDate !== undefined){
        if(currentDate.getHours() == userKenoDate.getHours() && currentDate.getDate() == userKenoDate.getDate()){
          return;
        }
      }
      const picked_numbers = await generate_numbers();
      user.keno_numbers = picked_numbers.toString();
      user.keno_date = currentDate.toString();
      await user.save();
      
      currentDate.setHours(currentDate.getHours() + 1)
      let hour_string = currentDate.getHours() % 12
      hour_string = hour_string==0?12:hour_string
      const attachment = await makeTicket(picked_numbers.toString(),currentDate.getDay(),currentDate.getMonth(),currentDate.getDate(),`${hour_string}o'clock`)
      
      const successEmbed = new EmbedBuilder()
        .setColor(0x009c2c)
        .setTitle(`${interaction.user.displayName} got a ${hour_string} o'clock Karma Keno Ticket with their DOTD!`)
        .setDescription(`Your numbers are: ${picked_numbers.toString()}`);

      await interaction.followUp({ embeds: [successEmbed], files: [attachment]});
    }
    async function generate_numbers(){
      let arr = [];
      while(arr.length < 10){
        let r = Math.floor(Math.random() * 80) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
      }
      arr.sort(function(a,b){return a-b});
      return arr;
    }
	},
};

