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
            .state('meeting.apply.result', {
                url: '/result/:id',
                templateUrl: 'partials/front/meeting/apply-result.html'
            });

        $urlRouterProvider
            .when('/meeting', '/meeting/overview')
            .when('/meeting/apply', '/meeting/apply/list');
    })

    .controller('MeetingOverviewCtrl', function ($scope, $state, SimpleGrid, MeetingService) {

        $scope.date = new Date();
        $scope.grid = SimpleGrid(MeetingService.queryMeetingList, {pageSize: 4});
        $scope.query = function () {
            $scope.grid.query({
                date: $scope.date == null ? undefined : DateFormat.date($scope.date, 'yyyy-MM-dd')
            });
        };
        $scope.checkState = function (state, type) {
            if (_.isEmpty(state)) {
                return true;
            }
            return ("" + state).indexOf(type) == -1;
        };

        $scope.onlyAfterdays = function (d) {
            return new Date().getTime() < (d.getTime() + 1000 * 60 * 60 * 24);
        };

        $scope.query();
    })

    .controller('MeetingPreviewCtrl', function ($scope, $state, MeetingService) {

        MeetingService.getMeeting($state.params.id).then(function (response) {
            $scope.meeting = response.data;
        });
    })


    .controller('MeetingApplyListCtrl', function ($scope, $state, SimpleGrid, MeetingService) {

        $scope.date = null;
        $scope.grid = SimpleGrid(MeetingService.queryMeetingApplyList);
        $scope.query = function () {
            $scope.grid.query({
                date: $scope.date == null ? undefined : DateFormat.date($scope.date, 'yyyy-MM-dd')
            });
        };

        $scope.query();

        $scope.getUseDateText = function (meetingApply) {
            var type = {
                1: '上午',
                2: '下午',
                3: '全天'
            };
            return DateFormat.date(new Date(meetingApply.useDateStart.time), 'yyyy-MM-dd')
                + ' ' + type[meetingApply.useDateStartType]
                + (meetingApply.useDateEnd ?
                    (' 至 ' + DateFormat.date(new Date(meetingApply.useDateEnd.time), 'yyyy-MM-dd') + ' ' + type[meetingApply.useDateEndType] ) : '');
        };
    })

    .controller('MeetingApplySubmitCtrl', function ($scope, $state, MeetingService) {

        $scope.meetingApply = {
            applyUserName: '张三',
            applyUserId: 1,
            useDateStartType: 3,
            useDateEndType: 3,
            meetingService: {}
        };
        MeetingService.getServiceList().then(function (response) {
            $scope.serviceList = response.data;
            _.each($scope.serviceList, function (item) {
                $scope.meetingApply.meetingService[item.id] = false;
            });
        });
        MeetingService.getMeeting($state.params.id).then(function (response) {
            $scope.meeting = response.data;
            $scope.meetingApply.meetingId = $scope.meeting.id;
            $scope.meetingApply.meetingName = $scope.meeting.name;
        });

        $scope.submit = function () {
            var serviceList = [];
            _.each($scope.meetingApply.meetingService, function (value, key) {
                if (value) {
                    serviceList.push(key);
                }
            });

            var meetingApply = {
                meetingId: $scope.meetingApply.meetingId,
                meetingName: $scope.meetingApply.meetingName,
                useDateStartType: $scope.meetingApply.useDateStartType,
                useDateEndType: $scope.meetingApply.useDateEndType,
                personNum: $scope.meetingApply.personNum,
                remark: $scope.meetingApply.remark,
                useDateStart: $scope.meetingApply.useDateStart,
                useDateEnd: $scope.meetingApply.useDateEnd,
                service: serviceList.join(',')
            };

            MeetingService.submitMeetingApply(meetingApply).then(function () {
                $state.transitionTo('meeting.apply.list');
            });
        };
    })
;
