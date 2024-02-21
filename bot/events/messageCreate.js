const { Events } = require('discord.js');
const { get_wiki } = require('../helper/get_wiki.js');
const fs = require('fs');

const MESSAGE_CHANCE = 0.02;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		await reply_to_mention(message);
		await send_wiki_text(message);
	},
};

// placing various message functions under here.
// these could be moved to their own file if it proves too much for one file.
async function send_wiki_text(message){
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
}

async function reply_to_mention(message){
	if(message.content.length == 0 || message.author.bot){
		return;
	}
	if(Math.random() <= MESSAGE_CHANCE){
		const DAVE_ID = "534608357001265152";
		if(message.content.includes(DAVE_ID) || message.content.toUpperCase().includes("DAVE")){
			//dave mentioned in message
			const DAVE_REPLIES = fs.readFileSync(__dirname + '/replies.txt', 'utf-8');
			const REPLIES_ARR = DAVE_REPLIES.split('\n');
			const REPLY_COUNT = REPLIES_ARR.length;
			const REPLY = REPLIES_ARR[Math.floor(Math.random()*REPLY_COUNT)];
			await message.channel.send(REPLY);
		}
	}
}