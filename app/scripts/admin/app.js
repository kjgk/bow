'use strict';

angular.module('app', ['admin.meetingroom'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/meetingroom');
    })

    .controller('MainCtrl', function ($scope) {

    })
;
