module.exports = (sequelize, DataTypes) => {
	return sequelize.define('replies', {
		text: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};