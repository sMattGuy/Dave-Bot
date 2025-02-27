const { Events } = require('discord.js');
const { Users, Fortunes } = require('../DB/functions/dbObjects.js')

const upvote_id = 1344451256449765399;
const downvote_id = 1344451255325687908; 

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(reaction) {
		if(reaction.partial){
      // do nothing
      console.log('partial received; ignoring')
      return;
    }
    if(reaction.me && reaction.message.author.id == process.env.CLIENTID && reaction.count >= 1){
      if(reaction.message.embeds.length != 0){
        const fortune = reaction.message.embeds[0].title;
       
        const id_regex = new RegExp("#\\d*")
        const hit_array = id_regex.exec(fortune)
        const id_number = parseInt(hit_array[0].slice(1));
        
        const fortune_found = await Fortunes.findOne({where:{id:id_number}});
        if(fortune_found){
          if(reaction.emoji.name == "👍"){
              fortune_found.rating--;
          }
          else if(reaction.emoji.name == "👎"){
              fortune_found.rating++;
          }
          fortune_found.save();
        }
      } 
    }
    if(reaction.message.author.id != process.env.CLIENTID){
      const reacted_users = await reaction.users.fetch()
      if(reaction.emoji.id == upvote_id){
        const user = await Users.findOne({where:{user_id: reaction.message.author.id}});
        user.karma -= 1;
        user.save();
      }
      else if(reaction.emoji.id == downvote_id){
        if(reacted_users.has(reaction.message.author.id)){
          return;
        }
        const user = await Users.findOne({where:{user_id: reaction.message.author.id}});
        user.karma += 1;
        user.save();
      }
    }
	},
};
