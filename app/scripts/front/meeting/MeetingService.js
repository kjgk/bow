'use strict';

angular.module('front.meeting')

    .factory('MeetingService', function ($q, $timeout, $http) {

        var me = {

            getMeeting: function (id) {
                return $http({
                    method: 'GET',
                    params: {'meeting.id': id},
                    url: '/meeting/ajax/meetingAction!getMeetingInfo.shtml'
                });
            },

            queryMeetingList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: '/meeting/ajax/meetingAction!getMeetingPageList.shtml'
                });
            },

            getServiceList: function () {
                return $http({
                    method: 'GET',
                    url: '/meeting/ajax/meetingAction!getMeetingServiceList.shtml'
                });
            },

            queryMeetingApplyList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: '/meeting/ajax/meetingAction!getMeetingApplyPageList.shtml'
                });
            },

            submitMeetingApply: function (meetingApply) {
                return $http({
                    method: 'POST',
                    url: '/meeting/ajax/meetingAction!submitMeetingApply.shtml',
                    data: {
                        meetingApply: meetingApply
                    }
                });
            },

            getMeetingApply: function (id) {
                return $http({
                    method: 'GET',
                    params: {
                        'meetingApply.id': id
                    },
                    url: '/meeting/ajax/meetingAction!getMeetingApplyInfo.shtml'
                });
            }
        };
        return me;
    })

;
