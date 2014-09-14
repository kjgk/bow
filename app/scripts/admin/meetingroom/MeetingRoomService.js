'use strict';

angular.module('admin.meetingroom')

    .factory('MeetingRoomService', function ($q, $timeout, $http, localStorageService, uuid4) {

        var me = {

            getMeetingRoom: function (id) {
                return $http({
                    method: 'GET',
                    params: {'meeting.id': id},
                    url: 'lsc/admin/meeting/ajax/meetingAdminAction!getMeetingInfo.shtml'
                });
            },

            getMeetingRoomList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: 'lsc/admin/meeting/ajax/meetingAdminAction!getMeetingPageList.shtml'
                });
            },

            createMeetingRoom: function (x) {
                return $http({
                    method: 'POST',
                    url: 'lsc/admin/meeting/ajax/meetingAdminAction!saveMeeting.shtml',
                    params: {
                        'meeting.name': x.name,
                        'meeting.floor': x.floor,
                        'meeting.personNum': x.personNum,
                        'meeting.description': x.description
                    }
                });
            },

            updateMeetingRoom: function (x) {
                return $http({
                    method: 'POST',
                    url: 'lsc/admin/meeting/ajax/meetingAdminAction!saveMeeting.shtml',
                    params: {
                        'meeting.id': x.id,
                        'meeting.name': x.name,
                        'meeting.floor': x.floor,
                        'meeting.personNum': x.personNum,
                        'meeting.description': x.description
                    }
                });
            },

            deleteMeetingRoom: function (x) {
                return $http({
                    method: 'POST',
                    url: 'lsc/admin/meeting/ajax/meetingAdminAction!deleteMeeting.shtml',
                    params: {
                        'meeting.id': x.id
                    }
                });
            },

            lockMeetingRoom: function (x) {
                x.lock = true;
                return me.updateMeetingRoom(x);
            },

            unlockMeetingRoom: function (x) {
                x.lock = false;
                return me.updateMeetingRoom(x);
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
