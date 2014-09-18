'use strict';

angular.module('front.meeting')

    .factory('MeetingService', function ($q, $timeout, $http, PageContext) {

        var me = {

            getMeeting: function (id) {
                return $http({
                    method: 'GET',
                    params: {'meeting.id': id},
                    url: PageContext.path + '/meeting/ajax/meetingAction!getMeetingInfo.shtml'
                });
            },

            queryMeetingList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: PageContext.path + '/meeting/ajax/meetingAction!getMeetingPageList.shtml'
                });
            },

            getServiceList: function () {
                return $http({
                    method: 'GET',
                    url: PageContext.path + '/meeting/ajax/meetingAction!getMeetingServiceList.shtml'
                });
            },

            queryMeetingApplyList: function (params) {
                return $http({
                    method: 'GET',
                    params: params,
                    url: PageContext.path + '/meeting/ajax/meetingAction!getMeetingApplyPageList.shtml'
                });
            },

            submitMeetingApply: function (meetingApply) {
                return $http({
                    method: 'POST',
                    url: PageContext.path + '/meeting/ajax/meetingAction!submitMeetingApply.shtml',
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
                    url: PageContext.path + '/meeting/ajax/meetingAction!getMeetingApplyInfo.shtml'
                });
            }
        };
        return me;
    })

;
