const { Events } = require('discord.js');
const { receiveClient } = require('../helper/items/nut_buster');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		receiveClient(client);
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};