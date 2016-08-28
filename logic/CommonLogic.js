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
        for(i = 0; i < phones.length; i++) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            res.push(re.test(email));
        }

        var result = res.indexOf(null);
        
        if(result > 0)
            return false;

        return true;
    },
    validatePhone: function (phones) {
        var re = [];
        var lc = [];

        for(i = 0; i < phones.length; i++) {
            var matcher = phone[i].match(/^\d+$/);
            re.push(matcher);

            var lengthChecker = phone[i].length > 12;
            lc.push(lengthChecker);
        }

        var result = re.indexOf(null);
        var lengthResult = re.indexOf(true);

        if(result > 0 || lengthResult > 0)
            return false;

        return true;
    }
};

module.exports = CommonLogic;
