var express = require('express');
var router = express.Router();
var contactLogic = require('../logic/ContactLogic');

router.get('/contacts', function (req, res) {
	contactLogic.getAllContacts(function (code, response) {
		res.status(code).json(response);
	});
});

router.post('/contacts', function (req, res) {
	var params = req.body;

	contactLogic.saveNewContact(params, function (code, response) {
		res.status(code).json(response);
	});
});

router.get('/contacts/:id', function (req, res) {
    var id = req.params.id;

	contactLogic.getContactById(id, function (code, response) {
		res.status(code).json(response);
	});
});

router.put('/contacts/:id', function (req, res) {
    var id = req.params.id;
	var params = req.body;

	contactLogic.editContact(id, params, function (code, response) {
		res.status(code).json(response);
	});
});

router.delete('/contacts/:id', function (req, res) {
    var id = req.params.id;

	contactLogic.deleteContact(id, function (code, response) {
		res.status(code).json(response);
	});
});

module.exports = router;
