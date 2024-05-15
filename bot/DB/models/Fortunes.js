module.exports = (sequelize, DataTypes) => {
	return sequelize.define('fortunes', {
		text: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
        author: {
			type: DataTypes.STRING,
			defaultValue: "Unknown",
			allowNull: false,
		},
        rating: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};