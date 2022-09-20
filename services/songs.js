const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
	const offset = helper.getOffset(page, config.listPerPage);
	const rows = await db.query(
		`SELECT id, title, artist, embedurl
    	FROM kq_songs LIMIT ${offset},${config.listPerPage}`
		);
	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return {
		data,
		meta
	}
}

async function create(song) {
	console.log('the song', song);
	const theQuery = `INSERT INTO kq_songs	(artist, title, embedurl)
		VALUES ("${song.artist.toString()}", "${song.title.toString()}", "${song.embedurl}")`;

	const result = await db.query(
			theQuery
  	);
  	let message = 'Error in creating';
  	if(result.affectedRows) {
  		message = 'Created Successfully';
  	}

  	return {
  	'id': result.insertId,
  	'artist': song.artist,
  	'title': song.title,
  	'embedurl': song.embedurl
  };
}

async function createBulk(songs) {
	/* remove current songs */
	let thing = await db.query(`DELETE FROM kq_songs`);
	const theQuery = `
           insert into kq_songs 
              (title, artist, embedurl)
              values ?
        `;
	const result = await db.query( theQuery, [songs]);
	
}

async function search(query) {
	const theQuery = 
	`SELECT id, title, artist, embedurl
	FROM kq_songs
	WHERE title LIKE "%${query.toString()}%" OR artist LIKE "%${query.toString()}%"`;
	const rows = await db.query(
		theQuery
	);
	const data = helper.emptyOrRows(rows);

	return data;
}


module.exports = {
	getMultiple,
	create,
	createBulk,
	search,
}