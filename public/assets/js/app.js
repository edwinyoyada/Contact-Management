var contactApp = angular.module('contactApp', ['ui.router', 'ngResource', 'contactApp.controllers', 'contactApp.services', 'ngFileUpload']);

contactApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/app');

    $stateProvider
        .state({
            name: 'app',
            url: '/app',
            templateUrl: 'partials/app.html',
            controller: 'contactListCtrl'
        })
        .state({
            name: 'app.detail',
            url: '/detail/:id',
            templateUrl: 'partials/detail.html',
            controller: 'contactDetailCtrl'
        })
        .state({
            name: 'app.info',
            url: '/info/:message',
            templateUrl: 'partials/info.html',
            controller: 'infoCtrl'
        })
        .state('about', {
            // we'll get to this in a bit
        });

});
