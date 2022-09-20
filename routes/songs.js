const express = require('express');
const router = express.Router();
const songs = require('../services/songs');

/* GET songs */
router.get('/', async function(req, res, next) {
	try {
		res.json(await songs.getMultiple(req.query.page));
	} catch (err) {
		console.error(`Error while getting data`, err.message);
		next(err);
	}
});

/* POST song */
router.post('/', async function(req, res, next) {
	try {
		if(req.body && req.body.length > 1){
			console.log('creating bulk songs')
			res.json(await songs.createBulk(req.body));
		} else {
			console.log('creating song')
			res.json(await songs.create(req.body));
		}
	} catch(err) {
		console.error(`Error while creating song`, err.message);
		next(err);
	}
});

/* SEARCH songs */
router.get('/search/:searchTerm?', async function(req, res, next) {
	if(req.query && req.query.searchTerm) {
		try {
			res.json(await songs.search(req.query.searchTerm));
		} catch(err) {
			console.error(`Error while creating song`, err.message);
			next(err);
		}
	}
});

module.exports = router;