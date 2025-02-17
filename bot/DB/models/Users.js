module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		karma: {
			type: DataTypes.INTEGER,
			defaultValue: 10,
			allowNull: false,
		},
    last_fortune: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
    keno_numbers: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    keno_date: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    }
	}, {
		timestamps: false,
	});
};
