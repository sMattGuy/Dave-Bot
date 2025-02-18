const { Events } = require('discord.js');
const { Fortunes } = require('../DB/functions/dbObjects.js')

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
	},
};
