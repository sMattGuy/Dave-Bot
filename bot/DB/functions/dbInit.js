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
const Channels = require('../models/Channels.js')(sequelize, Sequelize.DataTypes);
require('../models/Users.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');
const alter = process.argv.includes('--alter') || process.argv.includes('-a');

sequelize.sync({ force, alter }).then(async () => {
  for(const fortune_unit in fortune_data_formatted){
      const final_fortune = fortune_data_formatted[fortune_unit].split('\t');
      try {
        await Fortunes.findOrCreate({where: {'text':final_fortune[0], 'author':final_fortune[1]}});
      } catch (error) {
        console.log(`failed to enter: ${final_fortune[0]}, ${final_fortune[1]}`) 
      }
  } 
  for(const reply_unit in reply_data_formatted){
      await Replies.findOrCreate({where:{'text':reply_data_formatted[reply_unit]}});
  } 

	console.log('Database synced');

	sequelize.close();
}).catch(console.error);
