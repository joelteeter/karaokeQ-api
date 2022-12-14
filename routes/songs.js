const express = require('express');
const router = express.Router();
const songs = require('../services/songs');
const { body, param } = require('express-validator');

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
//TODO: validate embedurl is lenght of youtube videoId
router.post('/', 
	body('title').not().isEmpty().trim().escape(),
	body('artist').not().isEmpty().trim().escape(),
	body('embedurl').not().isEmpty().trim().escape(),
	async function(req, res, next) {
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

/* PUT song */
router.put('/:id', 
	param('id').trim().escape(), 
	body('title').not().isEmpty().trim().escape(),
	body('artist').not().isEmpty().trim().escape(),
	body('embedurl').not().isEmpty().trim().escape(),
	async function(req, res, next) {
	try {
		res.json(await songs.update(req.params.id, req.body));
	} catch (err) {
		console.error(`Error while updating song`, err.message);
		next(err);
	}
});

/* SEARCH songs */
router.get('/search/:searchTerm?',
	param('searchTerm').not().isEmpty().trim().escape(), 
	async function(req, res, next) {
	if(req.query && req.query.searchTerm) {
		try {
			res.json(await songs.search(req.query.searchTerm));
		} catch(err) {
			console.error(`Error while searching song`, err.message);
			next(err);
		}
	}
});

/* DELETE song */
router.delete('/:id',
	param('id').trim().escape(), 
	async function(req, res, next) {
  try {
    res.json(await songs.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting song`, err.message);
    next(err);
  }
});

module.exports = router;