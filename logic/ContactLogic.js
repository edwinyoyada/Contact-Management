var contact = require('../model/ContactModel');
var commonLogic = require('./CommonLogic');
var httpCodes = require('../helper/HttpCodes');
var messages = require('../helper/Messages');

var ContactLogic = {
    getAllContacts: function (callback) {
        contact.find({ is_active: true }, function (err, res) {
            var response = '';
            if(err) {
                response = commonLogic.buildResponse(messages.InternalServerError, err);
                callback(httpCodes.InternalServerError, response);
                return;
            }

            response = commonLogic.buildResponse(messages.OK, res);
            callback(httpCodes.OK, response);
        });
    },

    getContactById: function (id, callback) {
        contact.find({ _id: id, is_active: true }, function (err, contactData) {
            var response = '';
            if(err) {
                response = commonLogic.buildResponse(messages.InternalServerError, err);
                callback(httpCodes.InternalServerError, response);
                return;
            }

            if(contactData.length === 0) {
                response = commonLogic.buildResponse(messages.NotFound);
                callback(httpCodes.NotFound, response);
                return;
            }

            response = commonLogic.buildResponse(messages.OK, contactData);
            callback(httpCodes.OK, response);
        });
    },

    saveNewContact: function (params, callback) {
        var dis = this;
        contact.find({ $and: [ { $or: [ { name: params.name }, { email: params.email } ] }, { is_active: true } ] }, function (err, res) {
            var response = '';
            if(err) {
                response = commonLogic.buildResponse(messages.InternalServerError, err);
                callback(httpCodes.InternalServerError, response);
                return;
            }

            if(res.length > 0) {
                response = commonLogic.buildResponse(messages.ContactExists);
                callback(httpCodes.BadRequest, response);
                return;
            }

            var errors = dis.validate(params);
            if(errors.length > 0) {
                response = commonLogic.buildResponse(errors);
                callback(httpCodes.BadRequest, response);
                return;
            }

            var newContact = new contact({
                name: params.name,
                title: params.title,
            	email: params.email,
                phone: params.phone,
                address: params.address,
                company: params.company,
                is_active: true,
                last_update: commonLogic.getNow()
            });

            newContact.save(function (err, data) {
                response = commonLogic.buildResponse(messages.OK, messages.ContactCreated);
                callback(httpCodes.OK, response);
            });
        });
    },

    editContact: function (id, params, callback) {
        var dis = this;
        contact.findOne({ _id: id, is_active: true }, function (err, contactData) {
            var response = '';
            if(err) {
                response = commonLogic.buildResponse(messages.InternalServerError, err);
                callback(httpCodes.InternalServerError, response);
                return;
            }

            if(contactData.length === 0) {
                response = commonLogic.buildResponse(messages.NotFound);
                callback(httpCodes.NotFound, response);
                return;
            }

            var errors = dis.validate(params);
            if(errors.length > 0) {
                response = commonLogic.buildResponse(errors);
                callback(httpCodes.BadRequest, response);
                return;
            }

            contactData.email.pull();
            contactData.phone.pull();
            contactData.address.pull();

            contactData.name = params.name;
            contactData.title = params.title;
        	contactData.email = params.email;
            contactData.phone = params.phone;
            contactData.address = params.address;
            contactData.company = params.company;
            contactData.last_update = commonLogic.getNow();

            contactData.save(function (err, data) {
                response = commonLogic.buildResponse(messages.OK, messages.ContactUpdated);
                callback(httpCodes.OK, response);
            });
        });
    },

    deleteContact: function (id, callback) {
        contact.findOne({ _id: id, is_active: true }, function (err, contactData) {
            var response = '';
            if(err) {
                response = commonLogic.buildResponse(messages.InternalServerError, err);
                callback(httpCodes.InternalServerError, response);
                return;
            }

            if(contactData.length === 0) {
                response = commonLogic.buildResponse(messages.NotFound);
                callback(httpCodes.NotFound, response);
                return;
            }

            contactData.is_active = false;
            contactData.last_update = commonLogic.getNow();

            contactData.save(function (err, data) {
                response = commonLogic.buildResponse(messages.OK, messages.ContactUpdated);
                callback(httpCodes.OK, response);
            });
        });
    },

    validate: function (params) {
        var err = [];

        if(!commonLogic.validateEmail(params.email))
            err.push('Please enter correct email');

        if(!commonLogic.validatePhone(params.phone))
            err.push('Please enter correct phone number');

        return err;
    }
};

module.exports = ContactLogic;
