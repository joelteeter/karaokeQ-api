const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAll() {
	//TODO: i don't think i'll need this, if I do, paginate it as this is probably the biggest possible queries i'll make
	const rows = await db.query(
		`SELECT slips.id, slips.session_id, slips.position, singers.id AS singerID, singers.name, singers.color, songs.id AS songID, songs.artist, songs.title, songs.embedurl 
    FROM kq_singers AS singers 
    JOIN kq_slips AS slips ON singers.id = slips.singer_id 
    JOIN kq_songs AS songs ON slips.song_id = songs.id;`
		);
	const results = [];
	data = helper.decodeProperties(rows);;
	if(data.length > 0) {
		data.forEach( row => {
			let slip = {
		  	id: row.id,
		  	sessionId: row.session_id,
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

async function getAllBySessionId(sessionId) {

	const rows = await db.query(
		`SELECT slips.id, slips.session_id, slips.position, singers.id AS singerID, singers.name, singers.color, songs.id AS songID, songs.artist, songs.title, songs.embedurl 
    FROM kq_singers AS singers 
    JOIN kq_slips AS slips ON (singers.id = slips.singer_id AND slips.session_id = ${sessionId})
    JOIN kq_songs AS songs ON slips.song_id = songs.id
    ORDER BY slips.position;
    
    `
		);
	const results = [];
	data = helper.decodeProperties(rows);;
	if(data.length > 0) {
		data.forEach( row => {
			let slip = {
		  	id: row.id,
		  	sessionId: row.session_id,
		  	position: row.position,
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

async function getAllBySongId(songId) {

	const rows = await db.query(
		`SELECT slips.id, slips.session_id
    FROM kq_slips AS slips WHERE slips.song_id = ${songId};
    
    `
		);
	const results = [];
	data = helper.decodeProperties(rows);;
	if(data.length > 0) {
		data.forEach( row => {
			let slip = {
		  	id: row.id,
		  	sessionId: row.session_id,
		  	position: row.position,
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
			WHERE slips.id = ${Number(id)}`
  );
  let slip = helper.decodeProperties({
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
  })

  return {slip};
}

async function create(slip) {
	console.log('creating new slip', slip);
	const theQuery = `INSERT INTO kq_slips	(session_id, singer_id, song_id, position)
		VALUES ('${slip.sessionId}', '${slip.singer.id}', '${slip.song.id}', '${slip.position}')`;

	const result = await db.query(
			theQuery
  	);
  	let message = 'Error in creating';
  	if(result.affectedRows) {
  		message = 'Created Successfully';
  	}

  	return helper.decodeProperties({
  	'id': result.insertId,
  	'sessionId': slip.sessionId,
  	'position': slip.position,
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
  });
}

async function update(id, slip){
	const theQuery = `UPDATE kq_slips
		SET singer_id="${slip.singer.id}", song_id="${slip.song.id}", position="${slip.position}"
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
    message = 'Slip deleted successfully';
  }

  return {message};
}

async function removeBySessionId(sessionId){
  const result = await db.query(
    `DELETE FROM kq_slips WHERE session_id=${sessionId}`
  );

  let message = 'Error in deleting session slips';

  if (result.affectedRows) {
    message = 'Session slips deleted successfully';
  }

  return {message};
}

module.exports = {
	getAll,
	getAllBySessionId,
	getAllBySongId,
	get,
	create,
	update,
	remove,
	removeBySessionId
}