const express = require('express');
const router = express.Router();
const slips = require('../services/slips');

/* GET slips */
router.get('/', async function(req, res, next) {
	let sessionId = req.query.sessionid;
	if(sessionId) {
		try {
		res.json(await slips.getAllBySessionId(sessionId));
		} catch (err) {
			console.error(`Error while getting slips data`, err.message);
			next(err);
		}
	} else {
		try {
			res.json(await slips.getAll());
		} catch (err) {
			console.error(`Error while getting slips data`, err.message);
			next(err);
		}
	}
});
/* GET slips */
router.get('/:id', async function(req, res, next) {
	try {
		res.json(await slips.get(req.params.id));
	} catch (err) {
		console.error(`Error while getting slip data`, err.message);
		next(err);
	}
});

/* POST slip */
router.post('/', async function(req, res, next) {
	try {
		res.json(await slips.create(req.body));
	} catch(err) {
		console.error(`Error while creating slip`, err.message);
		next(err);
	}
});

/* PUT slip */
router.put('/:id', async function(req, res, next) {
	try {
		res.json(await slips.update(req.params.id, req.body));
	} catch (err) {
		console.error(`Error while updating slip`, err.message);
		next(err);
	}
});

/* DELETE slip */
router.delete('/:id', async function(req, res, next) {

	try {
    res.json(await slips.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting slip`, err.message);
    next(err);
  }
	
});
router.delete('/', async function(req, res, next) {
	let sessionId = req.query.sessionid;
	if(sessionId) {
	  try {
	    res.json(await slips.removeBySessionId(sessionId));
	  } catch (err) {
	    console.error(`Error while deleting session slips`, err.message);
	    next(err);
	  }
	}
});
module.exports = router;