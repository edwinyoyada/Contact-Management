var contact = require('../model/ContactModel');
var commonLogic = require('./CommonLogic');
var httpCodes = require('../helper/HttpCodes');
var messages = require('../helper/Messages');
var fs = require('fs');

var ContactLogic = {
    getAllContacts: function (query, callback) {

    	var searchParams = this.getSearchParams(query);

        contact.find(searchParams, function (err, res) {
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
                others: params.others,
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

            if(contactData.avatar != params.avatar)
                fs.unlink('./public/avatar/' + contactData.avatar);

            contactData.email.pull();
            contactData.phone.pull();
            contactData.address.pull();
            contactData.others.pull();

            contactData.name = params.name;
            contactData.title = params.title;
        	contactData.email = params.email;
            contactData.phone = params.phone;
            contactData.address = params.address;
            contactData.company = params.company;
            contactData.others = params.others;
            contactData.last_update = commonLogic.getNow();

            contactData.save(function (err, data) {
                response = commonLogic.buildResponse(messages.OK, messages.ContactUpdated);
                callback(httpCodes.OK, response);
            });
        });
    },

    editAvatar: function (id, params, callback) {
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

            if(contactData.avatar != params.avatar && contactData.avatar)
                fs.unlink('./public/assets/avatar/' + contactData.avatar);

            contactData.avatar = params.avatar;
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
    },

    getSearchParams: function (query) {
        var searchParams = {};

        var wildcard = query.wildcard;
    	var name = query.name;
    	var email = query.email;
    	var phone = query.phone;
    	var address = query.address;
    	var company = query.company;

        searchParams.is_active = true;

        if(wildcard !== "") {
            searchParams.name = new RegExp(wildcard, "i");
            searchParams.email = new RegExp(wildcard, "i");
            searchParams.phone = new RegExp(wildcard, "i");
            searchParams.address = new RegExp(wildcard, "i");
            searchParams.company = new RegExp(wildcard, "i");
            return searchParams;
        }

        if(name)
            searchParams.name = new RegExp(name, "i");

        if(email)
            searchParams.email = new RegExp(email, "i");

        if(phone)
            searchParams.phone = new RegExp(phone, "i");

        if(address)
            searchParams.address = new RegExp(address, "i");

        if(company)
            searchParams.company = new RegExp(company, "i");

        return searchParams;
    }
};

module.exports = ContactLogic;
