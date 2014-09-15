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
                return $http({
                    method: 'GET',
                    url: '/admin/meeting/ajax/meetingAdminAction!getMeetingServiceList.shtml'
                });
            },

            createService: function (serviceName) {

                return $http({
                    method: 'POST',
                    url: '/admin/meeting/ajax/meetingAdminAction!saveMeetingService.shtml',
                    params: {
                        'meetingService.serviceName': serviceName
                    }
                });
            },

            removeService: function (x) {
                return $http({
                    method: 'POST',
                    url: '/admin/meeting/ajax/meetingAdminAction!deleteMeetingService.shtml',
                    params: {
                        'meetingService.id': x.id
                    }
                });
            }
        };
        return me;
    })

;
