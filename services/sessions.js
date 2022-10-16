const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
	//TODO: use pagination, ie  LIMIT ${offset},${config.listPerPage}
	const offset = helper.getOffset(page, config.listPerPage);	
	const rows = await db.query(
		`SELECT id, name
    	FROM kq_sessions`
		);
	let data = helper.emptyOrRows(rows);
	data = helper.decodeProperties(rows);;
	const meta = {page};

	return data;
}

async function get(id){
  const result = await db.query(
    `SELECT id, name
     FROM kq_sessions WHERE id=${Number(id)}`
  );

  let message = 'Error in getting session';

  if (result.affectedRows) {
    message = 'Session GET successfull';
  }
  const returnResult = helper.decodeProperties(result)
  return returnResult;
}

async function create(session) {
	const theQuery = `INSERT INTO kq_sessions	(name)
		VALUES ('${session.name.toString()}')`;

	const result = await db.query(
			theQuery
  	);
  	let message = 'Error in creating';
  	if(result.affectedRows) {
  		message = 'Created Successfully';
  	}

  	return helper.decodeProperties({
	  	'id': result.insertId,
	  	'name': session.name
	  });
}

async function update(id, session){
	const theQuery = `UPDATE kq_sessions
		SET name="${session.name}"
	    WHERE id=${Number(id)}`;
	const result = await db.query(
		theQuery
	);

	let message = 'Error in updating session';

	if(result.affectedRows) {
		message = 'Session updated successfully';
	}

	return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM kq_sessions WHERE id=${id}`
  );

  let message = 'Error in deleting session';

  if (result.affectedRows) {
    message = 'Session deleted successfully';
  }

  return {message};
}

module.exports = {
	getMultiple,
	get,
	create,
	update,
	remove
}