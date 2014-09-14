'use strict';

angular.module('admin.meeting')

    .factory('MeetingService', function ($q, $timeout, $http, localStorageService) {

        var me = {

            getMeeting: function (id) {
                return $http({
                    method: 'GET',
                    params: {'meeting.id': id},
                    url: '/admin/meeting/ajax/meetingAdminAction!getMeetingInfo.shtml'
                });
            },

            getMeetingList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: '/admin/meeting/ajax/meetingAdminAction!getMeetingPageList.shtml'
                });
            },

            createMeeting: function (x) {
                return $http({
                    method: 'POST',
                    url: '/admin/meeting/ajax/meetingAdminAction!saveMeeting.shtml',
                    params: {
                        'meeting.name': x.name,
                        'meeting.floor': x.floor,
                        'meeting.personNum': x.personNum,
                        'meeting.description': x.description
                    }
                });
            },

            updateMeeting: function (x) {
                return $http({
                    method: 'POST',
                    url: '/admin/meeting/ajax/meetingAdminAction!saveMeeting.shtml',
                    params: {
                        'meeting.id': x.id,
                        'meeting.name': x.name,
                        'meeting.floor': x.floor,
                        'meeting.personNum': x.personNum,
                        'meeting.description': x.description
                    }
                });
            },

            deleteMeeting: function (x) {
                return $http({
                    method: 'POST',
                    url: '/admin/meeting/ajax/meetingAdminAction!deleteMeeting.shtml',
                    params: {
                        'meeting.id': x.id
                    }
                });
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
