const Sequelize = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: '../database.sqlite',
});

// files for data to input
const fortune_data = fs.readFileSync('../data/fortunes.txt','utf-8');
const reply_data = fs.readFileSync('../data/replies.txt','utf-8');

const regex = new RegExp("\\r?\\n");
const fortune_data_formatted = fortune_data.split(regex);
const reply_data_formatted = reply_data.split(regex);

// db objects
const Fortunes = require('../models/Fortunes.js')(sequelize, Sequelize.DataTypes);
const Replies = require('../models/Replies.js')(sequelize, Sequelize.DataTypes);
require('../models/Users.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');
const alter = process.argv.includes('--alter') || process.argv.includes('-a');

sequelize.sync({ force, alter }).then(async () => {
	const inputs = [];
    for(const fortune_unit in fortune_data_formatted){
        const final_fortune = fortune_data_formatted[fortune_unit].split('\t');
        inputs.push(Fortunes.upsert({'text':final_fortune[0], 'author':final_fortune[1]}));
    } 
    for(const reply_unit in reply_data_formatted){
        inputs.push(Replies.upsert({'text':reply_data_formatted[reply_unit]}));
    } 

	await Promise.all(inputs);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);
