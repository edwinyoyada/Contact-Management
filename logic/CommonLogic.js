var CommonLogic = {
    buildResponse: function (message, data) {
        if(!data)
            data = '';

        return { message: message, data: data };
    },
    getNow: function () {
        return new Date();
    },
    validateEmail: function (emails) {
        var res = [];

        for(i = 0; i < emails.length; i++) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            res.push(re.test(emails[i]));
        }

        var result = res.indexOf(false);

        if(result != -1)
            return false;

        return true;
    },
    validatePhone: function (phones) {
        var re = [];
        var lc = [];

        for(i = 0; i < phones.length; i++) {
            var matcher = phones[i].match(/^\d+$/);
            re.push(matcher);

            var lengthChecker = phones[i].length > 12;
            lc.push(lengthChecker);
        }

        var result = re.indexOf(null);
        var lengthResult = lc.indexOf(true);

        if(result != -1 || lengthResult != -1)
            return false;

        return true;
    },
    validateMimeType: function (mimeType) {
        var arrMimeType = [ 'image/jpeg', 'image/jpg', 'image/gif', 'image/png' ];

        return arrMimeType.indexOf(mimeType) > -1;
    },
};

module.exports = CommonLogic;
