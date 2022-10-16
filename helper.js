const he = require('he');

//for when/if i paginate things
function getOffset(currentPage = 1, listPerPage) {
	return (currentPage -1) * [listPerPage];
}

//return either array of rows or empty array
function emptyOrRows(rows) {
	if(!rows) {
		return [];
	}
	return rows;
}

// Decode string properties in: an array of objects, and object, or just a string
function decodeProperties(rows) {
	if(rows && rows.length > 0){
		for(let i=0; i < rows.length; i++) {
			if(rows && typeof rows === 'object') {
				for(const property in rows[i]) {
					if (typeof rows[i][property] === 'string') {
						rows[i][property] = he.decode(rows[i][property]);
					}
				}
			}
		}
		
	}
	else if(rows && typeof rows === 'object') {
		for(const property in rows) {
			if (typeof rows[property] === 'string') {
				rows[property] = he.decode(rows[property]);
			}
		}
	}
	else if(typeof rows === 'string') {
		rows = he.decode(rows);
	}
	return rows;
}

module.exports = {
	getOffset,
	emptyOrRows,
	decodeProperties
}