const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './DB/database.sqlite',
});

const Users = require('../models/Users.js')(sequelize, Sequelize.DataTypes);
const Fortunes = require('../models/Fortunes.js')(sequelize, Sequelize.DataTypes);
const Replies = require('../models/Replies.js')(sequelize, Sequelize.DataTypes);

module.exports = { Users, Fortunes, Replies };