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

async function balanceSlips(slips){
	/*
			*moved here from front end
      i'm breaking down the queue into peices with unique singers, then combining those pieces.
      each piece is a map of singer and song, if a slip has a singer who is already in a piece/map 
      then I add them to the next one that doesn't
  */
	if(slips && slips.length > 0 ) {

		const mapArray = [];
    const singerMap = new Map();

    //set the singer map, i can use this to determine how many pieces/maps I need
    //  foreach slip, map singer, to how many songs they have
    //  the max will be how many 'chunks' of the queue i need
    for(let i = 0; i < slips.length; i++) {
      if(singerMap.has(slips[i].singer.id)) {
        singerMap.set(slips[i].singer.id, singerMap.get(slips[i].singer.id) + 1)
      } else {
        singerMap.set(slips[i].singer.id, 1)
      }
    }
    const maxMaps = Math.max(...singerMap.values());

    //create the pieces/maps
    // creating them in memory so i loop through them and can assign values later
    for(let j = 0; j < maxMaps; j++) {
      mapArray.push(new Map());
    }
    
    //sort the slips into the pieces
    //  for each slip, see if a piece has a slip for the slip's singer
    //    if so, skip this piece and go on to the next
    //    if not, add this slip into the piece
    for(let s = 0; s < slips.length; s++) {
      for(let m = 0; m < maxMaps; m++) {
        //if singer doesn't have a slip in map[m], add one, then break from sub loop
        if(!mapArray[m].has(slips[s].singer.id)){
          mapArray[m].set(slips[s].singer.id, slips[s]);
          break;
        }
      }
    }

    //now for each piece, I grab the slips within and push them to what will be the new queue;
    // TODO: this mass update isn't great, could possibly send an array of just slip id and pos instead of so many smaller updates...
    let newQueue = [];
    let count = 1;
    mapArray.forEach( (map) => {
      map.forEach( (a) => {
        a.position = count;
        newQueue.push(a);
        //TODO: async here? possible data integrity issue?!?
        update(a.id, a);
        count++;
      })
    });

    //set the queue to the new queue

		return newQueue;
	}
	return null;
}

async function dragDropSlip(payload){
	//if moving DOWN the queue, need to offset things above its drop point
	//if moving UP the queue, need to offset things below its drop point
	//Then need to update the thing being dropped
	if(payload && payload.slip && payload.slips && payload.slips.length > 0) {
		let slips = payload.slips;
		const draggedFrom = payload.draggedFrom;
		const draggedTo = payload.draggedTo;
		const droppedPosition = payload.slips[draggedTo].position;

		if(draggedFrom < draggedTo) {
		  //was moved DOWN the queue
		  for(let i=draggedFrom; i <= draggedTo; i ++) {
		    slips[i].position -= 1;
		    update(slips[i].id, slips[i]);
		  }
		} else if (draggedFrom > draggedTo) {
		  //was moved UP the queue
		  for(let i=draggedTo; i < draggedFrom; i++) {
		    slips[i].position += 1;
		    update(slips[i].id, slips[i]);
		  }
		}
		slips[draggedFrom].position = droppedPosition;
		update(slips[draggedFrom].id, slips[draggedFrom]);

		return slips.sort((a, b) => (a.position > b.position) ? 1 : -1);
	}
	return "error on dragdrop";
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
	removeBySessionId,
	balanceSlips,
	dragDropSlip,
}