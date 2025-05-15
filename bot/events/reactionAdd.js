const { Events } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { Users, Fortunes } = require('../DB/functions/dbObjects.js')

const upvote_id = 1372713287996674060;
const downvote_id = 1372713300189774026; 

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction) {
    if(reaction.partial){
      // do nothing
      console.log('partial received; ignoring')
      return;
    }
    if(reaction.me && reaction.message.author.id == process.env.CLIENTID && reaction.count > 1){
      if(reaction.message.embeds.length != 0){
        const fortune = reaction.message.embeds[0].title;
        
        const id_regex = new RegExp("#\\d*")
        const hit_array = id_regex.exec(fortune)
        if(!hit_array){
          return;
        }
        const id_number = parseInt(hit_array[0].slice(1));

        const fortune_found = await Fortunes.findOne({where:{id:id_number}});
        if(fortune_found){
          if(reaction.emoji.name == "👍"){
              fortune_found.rating++;
          }
          else if(reaction.emoji.name == "👎"){
              fortune_found.rating--;
          }
          const updated_embed = new EmbedBuilder()
            .setColor(0x9c5b00)
            .setTitle(`#${fortune_found.id}: "${fortune_found.text}"`)
            .setDescription(`\\- ${fortune_found.author}`)
            .setFooter({text:`Fortune Rating: ${fortune_found.rating}`});
          reaction.message.edit({embeds:[updated_embed]})
          fortune_found.save();
        }
      } 
    }
    if(reaction.message.author.id != process.env.CLIENTID){
      const reacted_users = await reaction.users.fetch()
      if(reaction.message.author.bot){
        return;
      }
      if(reaction.emoji.id == upvote_id){
        if(reacted_users.has(reaction.message.author.id)){
          return;
        }
        let user = await Users.findOne({where:{user_id: reaction.message.author.id}});
        if(!user){
          user = await Users.create({user_id: reaction.message.author.id, karma: 10});
        }
        user.karma += 1;
        user.save();
      }
      else if(reaction.emoji.id == downvote_id){
        let user = await Users.findOne({where:{user_id: reaction.message.author.id}});
        if(!user){
          user = await Users.create({user_id: reaction.message.author.id, karma: 10});
        }
        user.karma -= 1;
        user.save();
      }
    }
	},
};
