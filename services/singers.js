const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
	const offset = helper.getOffset(page, config.listPerPage);	
	const rows = await db.query(
		`SELECT id, name, color
    	FROM kq_singers LIMIT ${offset},${config.listPerPage}`
		);
	const data = helper.emptyOrRows(rows);
	const meta = {page};

	return data;
}

async function get(id){
  const result = await db.query(
    `SELECT id, name, color
     FROM kq_singers WHERE id=${id}`
  );

  let message = 'Error in getting singer';

  if (result.affectedRows) {
    message = 'Singer GET successfull';
  }

  return {result};
}

async function create(singer) {

	const theQuery = `INSERT INTO kq_singers	(name, color)
		VALUES ('${singer.name.toString()}', '${singer.color.toString()}')`;

	const result = await db.query(
			theQuery
  	);
  	let message = 'Error in creating';
  	if(result.affectedRows) {
  		message = 'Created Successfully';
  	}

  	return {
  	'id': result.insertId,
  	'name': singer.name,
  	'color': singer.color,
  };
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

module.exports = {
	getMultiple,
	get,
	create,
	update,
	remove
}