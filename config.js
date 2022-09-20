require('dotenv').config();
const config = {
	db: {
		//normally don't do this...
		host: process.env.DB_HOSTNAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
	},
	listPerPage: 10,
};
module.exports = config;