require('dotenv').config();
const config = {
	db: {
		host: process.env.DB_HOSTNAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		port: process.env.DB_PORT || 3306,
		multipleStatements: true,
	},
	listPerPage: 10,
};
module.exports = config;