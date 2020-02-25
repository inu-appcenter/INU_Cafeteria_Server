'use strict';

require('module-alias/register');

const sqeulize = require('@infrastructure/database/sequelize');
const createServer = require('@infrastructure/webserver/server');

async function start() {
	try {
		await sequelize.sync();
		console.log('Connection to DB has been established successfully.');
	} catch (e) {
		console.error('Unable to connect to the database:', e);
	}

	try {
		const server = await createServer();
		await server.start();

		console.log('Server running at:', server.info.uri);
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

start();
