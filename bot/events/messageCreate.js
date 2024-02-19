const { Events } = require('discord.js');
const { get_wiki } = require('../helper/get_wiki.js');

const MESSAGE_CHANCE = 0.01;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if(message.content.length == 0 || message.author.bot){
			return;
		}
		// valid message test if going to send a chunk of text
		if(Math.random() <= MESSAGE_CHANCE){
			//message will be sent
			let wiki_text = await get_wiki();
			await message.channel.send('Let me tell you somethin\'...');
			await message.channel.sendTyping();
			setTimeout(() => {
				message.channel.send(wiki_text).catch(error => {message.channel.send('You know what... nevermind.');});
			}, "5000");
		}
	},
};