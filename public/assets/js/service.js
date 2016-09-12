var contactAppServices = angular.module('contactApp.services', []);

contactAppServices
    .factory('Contact', function ($resource) {
        return $resource('/api/contacts/:id', { id: '@_id' }, {
            update: { method: 'PUT' },
            query: { method: 'GET', isArray: false }
          });
    })
    .service('popupService', function($window){
        this.showPopup=function(message){
            return $window.confirm(message);
        };
    });
