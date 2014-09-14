'use strict';

angular.module('app', ['admin.meetingroom'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                template: '首页',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('/');
    })

    .controller('MainCtrl', function ($scope) {

    })
;
