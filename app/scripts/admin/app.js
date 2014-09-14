'use strict';

angular.module('app', ['admin.meeting'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/meeting');
    })

    .controller('MainCtrl', function ($scope) {

    })
;
