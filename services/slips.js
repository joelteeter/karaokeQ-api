const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAll() {

	const rows = await db.query(
		`SELECT slips.id, singers.id AS singerID, singers.name, singers.color, songs.id AS songID, songs.artist, songs.title, songs.embedurl 
    FROM kq_singers AS singers 
    JOIN kq_slips AS slips ON singers.id = slips.singer_id 
    JOIN kq_songs AS songs ON slips.song_id = songs.id;`
		);
	const results = [];
	if(rows.length > 0) {
		rows.forEach( row => {
			let slip = {
		  	id: row.id,
		  	singer: {
		  		id: row.singerID,
		  		name: row.name,
		  		color: row.color
		  	},
		  	song: {
		  		id: row.songID,
		  		artist: row.artist,
		  		title: row.title,
		  		embedurl: row.embedurl
		  	}
		  }
		  results.push(slip);
		})
	}

	return results;
}

async function get(id){
  const result = await db.query(
    `SELECT singers.id AS singerID, singers.name, singers.color, songs.id AS songID, songs.artist, songs.title, songs.embedurl 
    FROM kq_singers AS singers 
    JOIN kq_slips AS slips ON singers.id = slips.singer_id 
    JOIN kq_songs AS songs ON slips.song_id = songs.id;
			WHERE slips.id = ${id}`
  );
  let slip = {
  	id: id,
  	singer: {
  		id: result.singerID,
  		name: result.name,
  		color: result.color
  	},
  	song: {
  		id: result.songID,
  		artist: result.artist,
  		title: result.title,
  		embedurl: result.embedurl
  	}
  }

  return {slip};
}

async function create(slip) {
	console.log('creating new slip', slip);
	const theQuery = `INSERT INTO kq_slips	(singer_id, song_id, position)
		VALUES ('${slip.singer.id}', '${slip.song.id}', '${slip.position}')`;

	const result = await db.query(
			theQuery
  	);
  	let message = 'Error in creating';
  	if(result.affectedRows) {
  		message = 'Created Successfully';
  	}

  	return {
  	'id': result.insertId,
  	'singer': {
  		id: slip.singer.id,
  		name: slip.singer.name,
  		color: slip.singer.color
		},
		'song': {
			id: slip.song.id,
			artist: slip.song.artist,
			title: slip.song.title,
			embedurl: slip.song.embedurl
		},
		'isCollapsed': true
  };
}

async function update(id, slip){
	const theQuery = `UPDATE kq_slips
		SET singer_id="${slip.singer.id}", song_id="${slip.song.id}"
	    WHERE id=${Number(id)}`;
	const result = await db.query(
		theQuery
	);

	return {result};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM kq_slips WHERE id=${id}`
  );

  let message = 'Error in deleting slip';

  if (result.affectedRows) {
    message = 'Singer deleted successfully';
  }

  return {message};
}

module.exports = {
	getAll,
	get,
	create,
	update,
	remove
}