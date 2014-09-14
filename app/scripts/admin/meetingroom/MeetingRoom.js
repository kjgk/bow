'use strict';

angular.module('admin.meetingroom', ['base'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('meetingroom', {
                abstract: true,
                url: '/meetingroom',
                templateUrl: 'partials/admin/meetingroom/tab.html',
                controller: function ($scope, $state) {
                    $scope.tabs = [
                        {text: '未处理订单', state: 'meetingroom.unprocessed'},
                        {text: '已处理订单', state: 'meetingroom.processed'},
                        {text: '会场管理', state: 'meetingroom.list'},
                        {text: '服务管理', state: 'meetingroom.service'}
                    ];
                    $scope.checkActive = function (tab) {
                        var state = $state.current.name;
                        if (state === 'meetingroom.create' || state === 'meetingroom.update') {
                            state = 'meetingroom.list';
                        }
                        return tab.state === state;
                    };
                }
            })
            .state('meetingroom.unprocessed', {
                url: '/unprocessed',
                templateUrl: 'partials/admin/meetingroom/unprocessed.html',
                controller: 'MeetingRoomUnprocessedListCtrl'
            })
            .state('meetingroom.processed', {
                url: '/processed',
                templateUrl: 'partials/admin/meetingroom/processed.html',
                controller: 'MeetingRoomProcessedListCtrl'
            })
            .state('meetingroom.list', {
                url: '/list',
                templateUrl: 'partials/admin/meetingroom/list.html',
                controller: 'MeetingRoomListCtrl'
            })
            .state('meetingroom.create', {
                url: '/create',
                templateUrl: 'partials/admin/meetingroom/form.html',
                controller: 'MeetingRoomCreateCtrl'
            })
            .state('meetingroom.update', {
                url: '/update/:id',
                templateUrl: 'partials/admin/meetingroom/form.html',
                controller: 'MeetingRoomUpdateCtrl'
            })
            .state('meetingroom.service', {
                url: '/service',
                templateUrl: 'partials/admin/meetingroom/service.html',
                controller: 'MeetingRoomServiceCtrl'
            });

        $urlRouterProvider.when('/meetingroom', '/meetingroom/unprocessed');
    })

    .controller('MeetingRoomListCtrl', function ($scope, $timeout, $state, SimpleGrid, MeetingRoomService) {

        $scope.grid = SimpleGrid(MeetingRoomService.getMeetingRoomList);

        $scope.grid.query();

        $scope.createMeetingRoom = function () {
            $state.transitionTo('meetingroom.create');
        };

        $scope.updateMeetingRoom = function (x) {
            $state.transitionTo('meetingroom.update', {id: x.id});
        };

        $scope.toggleLock = function (x) {
            if (x.lock) {
                MeetingRoomService.unlockMeetingRoom(x).then($scope.grid.refresh);
            } else {
                MeetingRoomService.lockMeetingRoom(x).then($scope.grid.refresh);
            }
        };

        $scope.removeMeetingRoom = function (x) {
            MeetingRoomService.removeMeetingRoom(x).then($scope.grid.refresh);
        };
    })

    .controller('MeetingRoomCreateCtrl', function ($scope, $state, MeetingRoomService) {

        $scope.title = '新增会场';
        $scope.meetingRoom = {};
        $scope.submit = function () {
            MeetingRoomService.createMeetingRoom($scope.meetingRoom).then(function () {
                $state.transitionTo('meetingroom.list');
            });
        };
    })

    .controller('MeetingRoomUpdateCtrl', function ($scope, $state, MeetingRoomService) {

        $scope.title = '修改会场';
        MeetingRoomService.getMeetingRoom($state.params.id).then(function (result) {
            $scope.meetingRoom = result;
        });
        $scope.submit = function () {
            MeetingRoomService.updateMeetingRoom($scope.meetingRoom).then(function () {
                $state.transitionTo('meetingroom.list');
            });
        };
    })

    .controller('MeetingRoomProcessedListCtrl', function ($scope, $timeout, $state, SimpleGrid, MeetingRoomService) {

        $scope.grid = SimpleGrid(MeetingRoomService.getMeetingRoomList);

        $scope.grid.query();

        $scope.createMeetingRoom = function () {
            $state.transitionTo('meetingroom.create');
        };

        $scope.updateMeetingRoom = function (x) {
            $state.transitionTo('meetingroom.update', {id: x.id});
        };

        $scope.toggleLock = function (x) {
            if (x.lock) {
                MeetingRoomService.unlockMeetingRoom(x).then($scope.grid.refresh);
            } else {
                MeetingRoomService.lockMeetingRoom(x).then($scope.grid.refresh);
            }
        };

        $scope.removeMeetingRoom = function (x) {
            MeetingRoomService.removeMeetingRoom(x).then($scope.grid.refresh);
        };
    })

    .controller('MeetingRoomUnprocessedListCtrl', function ($scope, $timeout, $state, SimpleGrid, MeetingRoomService) {

        $scope.grid = SimpleGrid(MeetingRoomService.getMeetingRoomList);

        $scope.grid.query();

        $scope.createMeetingRoom = function () {
            $state.transitionTo('meetingroom.create');
        };

        $scope.updateMeetingRoom = function (x) {
            $state.transitionTo('meetingroom.update', {id: x.id});
        };

        $scope.toggleLock = function (x) {
            if (x.lock) {
                MeetingRoomService.unlockMeetingRoom(x).then($scope.grid.refresh);
            } else {
                MeetingRoomService.lockMeetingRoom(x).then($scope.grid.refresh);
            }
        };

        $scope.removeMeetingRoom = function (x) {
            MeetingRoomService.removeMeetingRoom(x).then($scope.grid.refresh);
        };
    })

    .controller('MeetingRoomServiceCtrl', function ($scope, MeetingRoomService) {

        $scope.service = '';

        MeetingRoomService.getServiceList().then(function (result) {
            $scope.serviceList = result;
        });

        $scope.removeService = function (x) {
            MeetingRoomService.removeService(x).then(function () {
                $scope.serviceList = _.without($scope.serviceList, x);
            });
        };

        $scope.createService = function () {
            if (!_.isEmpty($scope.service)) {
                MeetingRoomService.createService($scope.service).then(function () {
                    $scope.serviceList.push($scope.service);
                    $scope.service = '';
                });
            }
        };
    })
;
