'use strict';

angular.module('admin.meeting')

    .factory('MeetingService', function ($q, $timeout, $http, contextPath) {

        var me = {

            getMeeting: function (id) {
                return $http({
                    method: 'GET',
                    params: {'meeting.id': id},
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!getMeetingInfo.shtml'
                });
            },

            getMeetingList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!getMeetingPageList.shtml'
                });
            },

            createMeeting: function (meeting) {
                return $http({
                    method: 'POST',
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!saveMeeting.shtml',
                    data: {
                        meeting: meeting
                    }
                });
            },

            updateMeeting: function (meeting) {
                return $http({
                    method: 'POST',
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!saveMeeting.shtml',
                    data: {
                        meeting: meeting
                    }
                });
            },

            deleteMeeting: function (id) {
                return $http({
                    method: 'POST',
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!deleteMeeting.shtml',
                    data: {
                        meeting: {
                            id: id
                        }
                    }
                });
            },

            getServiceList: function () {
                return $http({
                    method: 'GET',
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!getMeetingServiceList.shtml'
                });
            },

            createService: function (serviceName) {

                return $http({
                    method: 'POST',
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!saveMeetingService.shtml',
                    data: {
                        meetingService: {
                            serviceName: serviceName
                        }
                    }
                });
            },

            removeService: function (id) {
                return $http({
                    method: 'POST',
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!deleteMeetingService.shtml',
                    data: {
                        meetingService: {
                            id: id
                        }
                    }
                });
            },

            queryMeetingApplyList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!getMeetingApplyPageList.shtml'
                });
            },

            getMeetingApply: function (id) {
                return $http({
                    method: 'GET',
                    params: {
                        'meetingApply.id': id
                    },
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!getMeetingApplyInfo.shtml'
                });
            },

            processMeetingApply: function (data) {
                return $http({
                    method: 'POST',
                    url: contextPath + '/admin/meeting/ajax/meetingAdminAction!processMeetingApply.shtml',
                    data: {
                        meetingApply: data
                    }
                });
            }
        };
        return me;
    })
;
