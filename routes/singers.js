const express = require('express');
const router = express.Router();
const singers = require('../services/singers');
const { body } = require('express-validator');

/* GET singers */
router.get('/', async function(req, res, next) {
	let sessionId = req.query.sessionid;
	if(sessionId) {
		try {
			res.json(await singers.getMultiple(sessionId));
		} catch (err) {
			console.error(`Error while getting singers data`, err.message);
			next(err);
		}
	}
});
/* GET singer */
router.get('/:id', async function(req, res, next) {
	let sessionId = req.query.sessionid;
	if(sessionId) {
		try {
			res.json(await singers.get(req.params.id, sessionId));
		} catch (err) {
			console.error(`Error while getting singer data`, err.message);
			next(err);
		}
	}
});

/* POST singer */
router.post('/', 
	body('name').not().isEmpty().trim().escape(),
	body('color').not().isEmpty().trim().escape(),
	async function(req, res, next) {
	try {
		res.json(await singers.create(req.body));
	} catch(err) {
		console.error(`Error while creating singer`, err.message);
		next(err);
	}
});

/* PUT singer */
router.put('/:id',
	body('name').not().isEmpty().trim().escape(),
	body('color').not().isEmpty().trim().escape(),
 async function(req, res, next) {
	try {
		res.json(await singers.update(req.params.id, req.body));
	} catch (err) {
		console.error(`Error while updating singer`, err.message);
		next(err);
	}
});

/* DELETE singer by id */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await singers.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting singer`, err.message);
    next(err);
  }	
});
/* DELETE singers by sessionsId */
router.delete('/', async function(req, res, next) {
	let sessionId = req.query.sessionid;
	if(sessionId) {
	  try {
	    res.json(await singers.removeBySessionId(sessionId));
	  } catch (err) {
	    console.error(`Error while deleting session singers`, err.message);
	    next(err);
	  }
	}
});

module.exports = router;