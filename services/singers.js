const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(session_id) {
	const rows = await db.query(
		`SELECT id, session_id, name, color
    	FROM kq_singers 
    	WHERE kq_singers.session_id = ${session_id};`
		);
	let data = helper.emptyOrRows(rows);
	data = helper.decodeProperties(rows);

	return data;
}

async function get(id, session_id){
  const result = await db.query(
    `SELECT id, session_id, name, color
     FROM kq_singers WHERE id=${Number(id)}`
  );

  let message = 'Error in getting singer';

  if (result.affectedRows) {
    message = 'Singer GET successfull';
  }
  const returnResult = helper.decodeProperties(result);
  return {returnResult};
}

async function create(singer) {

	const theQuery = `INSERT INTO kq_singers	(session_id, name, color)
		VALUES ('${singer.sessionId}','${singer.name.toString()}', '${singer.color.toString()}')`;

	const result = await db.query(
			theQuery
  	);
  	let message = 'Error in creating';
  	if(result.affectedRows) {
  		message = 'Created Successfully';
  	}

  	const returnResult = {
			'id': result.insertId,
			'sessionId': singer.sessionId,
			'name': singer.name,
			'color': singer.color,
	  };
	  return helper.decodeProperties(returnResult);
}

async function update(id, singer){
	const theQuery = `UPDATE kq_singers
		SET name="${singer.name}", color="${singer.color}"
	    WHERE id=${Number(id)}`;
	const result = await db.query(
		theQuery
	);

	let message = 'Error in updating singer';

	if(result.affectedRows) {
		message = 'Singer updated successfully';
	}

	return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM kq_singers WHERE id=${id}`
  );

  let message = 'Error in deleting singer';

  if (result.affectedRows) {
    message = 'Singer deleted successfully';
  }

  return {message};
}

async function removeBySessionId(sessionId){
  const result = await db.query(
    `DELETE FROM kq_singers WHERE session_id=${sessionId}`
  );

  let message = 'Error in deleting session singers';

  if (result.affectedRows) {
    message = 'Session singers deleted successfully';
  }

  return {message};
}

module.exports = {
	getMultiple,
	get,
	create,
	update,
	remove,
	removeBySessionId
}