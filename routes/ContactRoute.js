var express = require('express');
var router = express.Router();
var contactLogic = require('../logic/ContactLogic');
var commonLogic = require('../logic/CommonLogic');
var httpCodes = require('../helper/HttpCodes');
var messages = require('../helper/Messages');
var fs = require('fs');

router.get('/contacts', function (req, res) {
	var query = req.query;

	contactLogic.getAllContacts(query, function (code, response) {
		res.status(code).json(response);
	});
});

router.post('/contacts', function (req, res) {
	var params = req.body;

	contactLogic.saveNewContact(params, function (code, response) {
		res.status(code).json(response);
	});
});

router.post('/contacts/avatars/:id', function (req, res) {
	var fields = [];
    var id = req.params.id;

	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		if(!commonLogic.validateMimeType(mimetype)) {
			res.status(httpCodes.BadRequest).json({ message: messages.BadImageType, data: ''});
		}

		file.pipe(fs.createWriteStream('./public/assets/avatar/' + filename));
		fields[fieldname] = filename;
	});
	req.busboy.on('finish', function () {
		contactLogic.editAvatar(id, fields, function (code, response) {
			res.status(code).json(response);
		});
	});
	req.pipe(req.busboy);
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
