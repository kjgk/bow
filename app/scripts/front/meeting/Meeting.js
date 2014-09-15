'use strict';

angular.module('front.meeting', ['base'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('meeting', {
                abstract: true,
                url: '/meeting',
                template: '<div ui-view></div>'
            })
            .state('meeting.overview', {
                url: '/overview',
                templateUrl: 'partials/front/meeting/overview.html',
                controller: 'MeetingOverviewCtrl'
            })
            .state('meeting.preview', {
                url: '/preview/:id',
                templateUrl: 'partials/front/meeting/preview.html',
                controller: 'MeetingPreviewCtrl'
            })
            .state('meeting.apply', {
                abstract: true,
                url: '/apply',
                template: '<div ui-view></div>'
            })
            .state('meeting.apply.submit', {
                url: '/submit/:id',
                templateUrl: 'partials/front/meeting/apply-submit.html',
                controller: 'MeetingApplySubmitCtrl'
            })
            .state('meeting.apply.list', {
                url: '/list',
                templateUrl: 'partials/front/meeting/apply-list.html',
                controller: 'MeetingApplyListCtrl'
            })
            .state('meeting.apply.success', {
                url: '/success/:id',
                templateUrl: 'partials/front/meeting/apply-success.html'
            })
            .state('meeting.apply.fail', {
                url: '/fail/:id',
                templateUrl: 'partials/front/meeting/apply-fail.html'
            });

        $urlRouterProvider
            .when('/meeting', '/meeting/overview')
            .when('/meeting/apply', '/meeting/apply/list');
    })


    .controller('MeetingOverviewCtrl', function ($scope, $filter, $state, SimpleGrid, MeetingService) {

        $scope.date = null;

        $scope.grid = SimpleGrid(MeetingService.queryMeeting, {pageSize: 4});

        $scope.grid.query();

        $scope.query = function () {
            $scope.grid.query({
                date: $scope.date == null ? undefined : $filter('date')($scope.date.getTime(), 'yyyy-MM-dd')
            });
        };
    })

    .controller('MeetingPreviewCtrl', function ($scope) {

    })


    .controller('MeetingApplyListCtrl', function ($scope) {

    })

    .controller('MeetingApplySubmitCtrl', function ($scope) {

    })
;
