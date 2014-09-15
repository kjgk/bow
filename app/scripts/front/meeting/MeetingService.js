'use strict';

angular.module('front.meeting')

    .factory('MeetingService', function ($q, $timeout, $http, localStorageService) {

        var me = {

            getMeeting: function (id) {
                return $http({
                    method: 'GET',
                    params: {'meeting.id': id},
                    url: '/meeting/ajax/meetingAction!getMeetingInfo.shtml'
                });
            },

            queryMeeting: function (params) {
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

            submitMeetingApply: function (x) {
                return $http({
                    method: 'POST',
                    url: '/meeting/ajax/meetingAction!saveMeeting.shtml',
                    data: x,
                    transform: true
                });
            }
        };
        return me;
    })

;
