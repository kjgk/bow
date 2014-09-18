'use strict';

angular.module('admin.meeting', ['base'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('meeting', {
                abstract: true,
                url: '/meeting',
                templateUrl: 'partials/admin/meeting/tab.html',
                controller: function ($scope, $state) {
                    $scope.tabs = [
                        {text: '未处理订单', state: 'meeting.unprocessed'},
                        {text: '已处理订单', state: 'meeting.processed'},
                        {text: '会场管理', state: 'meeting.list'},
                        {text: '服务管理', state: 'meeting.service'}
                    ];
                    $scope.checkActive = function (tab) {
                        var state = $state.current.name;
                        if (state === 'meeting.create' || state === 'meeting.update') {
                            state = 'meeting.list';
                        }
                        if (state === 'meeting.process') {
                            state = 'meeting.unprocessed';
                        }
                        return tab.state === state;
                    };
                }
            })
            .state('meeting.unprocessed', {
                url: '/unprocessed',
                templateUrl: 'partials/admin/meeting/unprocessed-list.html',
                controller: 'MeetingUnprocessedListCtrl'
            })
            .state('meeting.process', {
                url: '/process/:id',
                templateUrl: 'partials/admin/meeting/process.html',
                controller: 'MeetingProcessCtrl'
            })
            .state('meeting.processed', {
                url: '/processed',
                templateUrl: 'partials/admin/meeting/processed-list.html',
                controller: 'MeetingProcessedListCtrl'
            })
            .state('meeting.list', {
                url: '/list',
                templateUrl: 'partials/admin/meeting/meeting-list.html',
                controller: 'MeetingListCtrl'
            })
            .state('meeting.create', {
                url: '/create',
                templateUrl: 'partials/admin/meeting/meeting-form.html',
                controller: 'MeetingCreateCtrl'
            })
            .state('meeting.update', {
                url: '/update/:id',
                templateUrl: 'partials/admin/meeting/meeting-form.html',
                controller: 'MeetingUpdateCtrl'
            })
            .state('meeting.service', {
                url: '/service',
                templateUrl: 'partials/admin/meeting/service.html',
                controller: 'MeetingServiceCtrl'
            });

        $urlRouterProvider.when('/meeting', '/meeting/unprocessed');
    })

    .controller('MeetingListCtrl', function ($scope, $timeout, $state, SimpleGrid, MeetingService) {

        $scope.grid = SimpleGrid(MeetingService.getMeetingList);

        $scope.grid.query();

        $scope.createMeeting = function () {
            $state.transitionTo('meeting.create');
        };

        $scope.updateMeeting = function (x) {
            $state.transitionTo('meeting.update', {id: x.id});
        };

        $scope.deleteMeeting = function (x) {
            if (window.confirm('确认删除？')) {
                MeetingService.deleteMeeting(x.id).then(function () {
                    $scope.grid.refresh();
                });
            }
        };
    })

    .controller('MeetingCreateCtrl', function ($scope, $state, MeetingService, FileUploader) {

        $scope.title = '新增会场';
        $scope.meeting = {};

        $scope.submit = function () {
            MeetingService.createMeeting($scope.meeting).then(function () {
                $state.transitionTo('meeting.list');
            });
        };

        var uploader = $scope.uploader = new FileUploader({
            url: $scope.contextPath + '/admin/meeting/ajax/meetingAdminAction!uploadMeetingImage.shtml',
            alias: 'image',
            removeAfterUpload: true,
            autoUpload: true
        });

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.meeting.imgUrl = response;
        };
    })

    .controller('MeetingUpdateCtrl', function ($scope, $state, MeetingService, FileUploader) {

        $scope.title = '修改会场';
        MeetingService.getMeeting($state.params.id).then(function (response) {
            $scope.meeting = response.data;
        });
        $scope.submit = function () {
            MeetingService.updateMeeting($scope.meeting).then(function () {
                $state.transitionTo('meeting.list');
            });
        };

        var uploader = $scope.uploader = new FileUploader({
            url: $scope.contextPath + '/admin/meeting/ajax/meetingAdminAction!uploadMeetingImage.shtml',
            alias: 'image',
            removeAfterUpload: true,
            autoUpload: true
        });

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.meeting.imgUrl = response;
        };
    })

    .controller('MeetingUnprocessedListCtrl', function ($scope, $timeout, $state, SimpleGrid, MeetingService, MeetingApplyStatus) {

        $scope.date = null;
        $scope.grid = SimpleGrid(MeetingService.queryMeetingApplyList);
        $scope.query = function () {
            $scope.grid.query({
                status: MeetingApplyStatus.SUBMIT,
                applyUserName: $scope.applyUserName,
                date: $scope.date == null ? undefined : DateFormat.date($scope.date, 'yyyy-MM-dd')
            });
        };

        $scope.query();

        $scope.process = function (id) {
            $state.transitionTo('meeting.process', {id: id})
        };
    })

    .controller('MeetingProcessCtrl', function ($scope, $state, MeetingService, MeetingApplyStatus) {

        MeetingService.getMeetingApply($state.params.id).then(function (response) {
            $scope.meetingApply = response.data;
        });

        $scope.applyResult = '';

        $scope.MeetingApplyStatus = MeetingApplyStatus;

        $scope.submit = function (status) {
            MeetingService.processMeetingApply({
                id: $state.params.id,
                status: status,
                applyResult: $scope.applyResult
            }).then(function () {
                $state.transitionTo('meeting.unprocessed');
            });
        }
    })

    .controller('MeetingProcessedListCtrl', function ($scope, $timeout, $sce, $state, SimpleGrid, MeetingService, MeetingApplyStatus) {

        $scope.date = null;
        $scope.grid = SimpleGrid(MeetingService.queryMeetingApplyList);
        $scope.query = function () {
            $scope.grid.query({
                status: [MeetingApplyStatus.SUCCESS, MeetingApplyStatus.FAIL].join(),
                applyUserName: $scope.applyUserName,
                date: $scope.date == null ? undefined : DateFormat.date($scope.date, 'yyyy-MM-dd')
            });
        };
        $scope.getStatusText = function (status) {
            return {
                3: $sce.trustAsHtml('<span class="alan">同意</span>'),
                4: $sce.trustAsHtml('<span class="ahong">退回</span>')
            }[status]
        };

        $scope.query();
    })

    .controller('MeetingServiceCtrl', function ($scope, MeetingService) {

        $scope.serviceName = '';

        $scope.serviceList = [];

        $scope.getServiceList = function () {
            MeetingService.getServiceList().then(function (result) {
                $scope.serviceList = result.data;
            });
        }

        $scope.removeService = function (x) {
            MeetingService.removeService(x.id).then(function () {
                $scope.getServiceList();
            });
        };

        $scope.createService = function () {
            if (!_.isEmpty($scope.serviceName)) {
                MeetingService.createService($scope.serviceName).then(function () {
                    $scope.getServiceList();
                    $scope.serviceName = '';
                });

            }
        };

        $scope.getServiceList();
    })
;
