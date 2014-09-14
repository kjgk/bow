'use strict';

angular.module('admin.meetingroom')

    .factory('MeetingRoomService', function ($q, $timeout, localStorageService, uuid4) {

        var me = {

            getMeetingRoom: function (id) {
                var defer = $q.defer();
                $timeout(function () {
                    defer.resolve(_.where(localStorageService.get('meetingRoomList') || [], {id: id})[0]);
                });
                return defer.promise;
            },

            getMeetingRoomList: function (params) {
                var defer = $q.defer();
                $timeout(function () {
                    var list = localStorageService.get('meetingRoomList') || [];
                    if (params) {
                        var start = (params.page - 1) * params.pageSize;
                        var end = start + params.pageSize;
                        defer.resolve({
                            totalCount: list.length,
                            items: list.slice(start, end)
                        });
                    } else {
                        defer.resolve(list);
                    }

                });
                return defer.promise;
            },

            createMeetingRoom: function (x) {
                var defer = $q.defer();
                $timeout(function () {
                    me.getMeetingRoomList().then(function (result) {
                        x.id = uuid4.generate();
                        x.createTime = new Date();
                        x.lock = false;
                        result.push(x);
                        localStorageService.set('meetingRoomList', result);
                    });
                    defer.resolve(true);
                });
                return defer.promise;
            },

            updateMeetingRoom: function (x) {
                var defer = $q.defer();
                $timeout(function () {
                    me.getMeetingRoomList().then(function (result) {
                        _.each(result, function (item) {
                            if (item.id === x.id) {
                                _.extend(item, x);
                            }
                        });
                        localStorageService.set('meetingRoomList', result);
                    });
                    defer.resolve(true);
                });
                return defer.promise;
            },

            lockMeetingRoom: function (x) {
                x.lock = true;
                return me.updateMeetingRoom(x);
            },

            unlockMeetingRoom: function (x) {
                x.lock = false;
                return me.updateMeetingRoom(x);
            },

            removeMeetingRoom: function (x) {
                var defer = $q.defer();
                $timeout(function () {
                    me.getMeetingRoomList().then(function (result) {
                        localStorageService.set('meetingRoomList', _.filter(result, function (item) {
                            return item.id !== x.id;
                        }));
                    });
                    defer.resolve(true);
                });
                return defer.promise;
            },

            getServiceList: function () {
                var defer = $q.defer();
                $timeout(function () {
                    defer.resolve(localStorageService.get('serviceList') || [
                        '纸巾', '茶水', '纸杯', '投影', '仪话筒'
                    ]);
                });
                return defer.promise;
            },

            createService: function (x) {
                var defer = $q.defer();
                $timeout(function () {
                    me.getServiceList().then(function (result) {
                        result.push(x);
                        localStorageService.set('serviceList', result);
                    });
                    defer.resolve(true);
                });
                return defer.promise;
            },

            removeService: function (x) {
                var defer = $q.defer();
                $timeout(function () {
                    me.getServiceList().then(function (result) {
                        localStorageService.set('serviceList', _.without(result, x));
                    });
                    defer.resolve(true);
                });
                return defer.promise;
            }
        };
        return me;
    })

;
