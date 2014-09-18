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
                templateUrl: 'partials/front/meeting/apply-result.html',
                controller: 'MeetingApplyResultCtrl'
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
    })

    .controller('MeetingApplySubmitCtrl', function ($scope, $state, MeetingService, PageContext) {

        $scope.meetingApply = {
            applyUserName: PageContext.currentUser.name,
            applyUserId: PageContext.currentUser.id,
            useDateStartType: 3,
            useDateEndType: 3,
            useDateStart: new Date(),
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

        $scope.checkEndDate = function (date) {
            if (date == null) {
                return true;
            }
            return  date.getTime() > $scope.meetingApply.useDateStart.getTime();
        };

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
                service: serviceList.join()
            };

            MeetingService.submitMeetingApply(meetingApply).then(function (response) {
                if (response.data.result == 1) {
                    $state.transitionTo('meeting.apply.list');
                }
                if (response.data.result == 0) {

                    var meetingApplyDate = response.data.meetingApplyDate;
                    var text = "“" + DateFormat.date(new Date(meetingApplyDate.useDate.time), 'yyyy-MM-dd')
                        + {1:'上午',2:'下午'}[meetingApplyDate.useDateType] + '”已经被预定，请重新选择。';
                    alert(text);
                }
            });
        };
    })

    .controller('MeetingApplyResultCtrl', function ($scope, $state, MeetingService, MeetingApplyStatus) {

        $scope.MeetingApplyStatus = MeetingApplyStatus;
        MeetingService.getMeetingApply($state.params.id).then(function (response) {
            $scope.meetingApply = response.data;
        });
    })
;
