const express = require('express');
const router = express.Router();
const sessions = require('../services/sessions');

/* GET sessions */
router.get('/', async function(req, res, next) {
	try {
		res.json(await sessions.getMultiple(req.query.page));
	} catch (err) {
		console.error(`Error while getting sessions data`, err.message);
		next(err);
	}
});
/* GET sessions */
router.get('/:id', async function(req, res, next) {
	try {
		res.json(await sessions.get(req.params.id));
	} catch (err) {
		console.error(`Error while getting session data`, err.message);
		next(err);
	}
});

/* POST session */
router.post('/', async function(req, res, next) {
	try {
		res.json(await sessions.create(req.body));
	} catch(err) {
		console.error(`Error while creating session`, err.message);
		next(err);
	}
});

/* PUT session */
router.put('/:id', async function(req, res, next) {
	try {
		res.json(await sessions.update(req.params.id, req.body));
	} catch (err) {
		console.error(`Error while updating session`, err.message);
		next(err);
	}
});

/* DELETE session */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await sessions.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting session`, err.message);
    next(err);
  }
});

module.exports = router;