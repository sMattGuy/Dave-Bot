const { Events } = require('discord.js');
const { get_wiki } = require('../helper/get_wiki.js');

const MESSAGE_CHANCE = 0.01;

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

const DAVE_REPLIES = ["Hold up.","I\'m editing one sec.","Bet.","What\'s good.","We out to Taco Express?","One sec on the phone.","Burritos?","Maybe in an hour.","Cleaning my car.","Mid set hold up.","I\'ll hop on soon.","Fifa?","Lethal?","Titanfall?","Let me tell you somethin\'..... Nevermind.","Gotta dip in like 30 mins.","wya."];
async function reply_to_mention(message){
	if(message.content.length == 0 || message.author.bot){
		return;
	}
	const DAVE_ID = "534608357001265152";
	if(message.content.includes(DAVE_ID)){
		//dave mentioned in message
		await message.channel.send(DAVE_REPLIES[Math.floor(Math.random()*DAVE_REPLIES.length)]);
	}
}