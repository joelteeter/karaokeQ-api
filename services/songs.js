const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
	//TODO: pagify these, front end too!
	const offset = helper.getOffset(page, config.listPerPage);
	const rows = await db.query(
		`SELECT id, title, artist, embedurl, validation_requested
    	FROM kq_songs`
		);
	let data = helper.emptyOrRows(rows);
	const meta = {page};
	data = helper.decodeProperties(data);

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

  	return helper.decodeProperties({
	  	'id': result.insertId,
	  	'artist': song.artist,
	  	'title': song.title,
	  	'embedurl': song.embedurl
	  });
}

async function createBulk(songs) {
	/* remove current songs */
	//TODO: remove, this is from karafun data dump
	let thing = await db.query(`DELETE FROM kq_songs`);
	const theQuery = `
           insert into kq_songs 
              (title, artist, embedurl)
              values ?
        `;
	const result = await db.query( theQuery, [songs]);
	
}

async function update(id, song){
	const theQuery = `UPDATE kq_songs
		SET artist="${song.artist}", title="${song.title}", embedurl="${song.embedurl}", validation_requested="${song.validation_requested ? 1 : 0}" 
	    WHERE id=${Number(id)}`;
	const result = await db.query(
		theQuery
	);

	let message = 'Error in updating song';

	if(result.affectedRows) {
		message = 'Song updated successfully';
	}

	return {message};
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

	return helper.decodeProperties(data);
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM kq_songs WHERE id=${id}`
  );

  let message = 'Error in deleting song';

  if (result.affectedRows) {
    message = 'Song deleted successfully';
  }

  return {message};
}


module.exports = {
	getMultiple,
	create,
	createBulk,
	update,
	search,
	remove,
}