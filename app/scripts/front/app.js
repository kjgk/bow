'use strict';

angular.module('app', ['front.meeting'])
    .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/meeting');

        $httpProvider.interceptors.push(function ($q, $location, $filter, cfpLoadingBar) {
            return {
                'request': function (request) {

                    if (request.url.indexOf("/meeting") == 0) {
                        request.url = "/lsc" + (request.url[0] == '/' ? '' : '/') + request.url;
                    }

                    if (request.cfpLoading === undefined || request.cfpLoading) {
                        cfpLoadingBar.start();
                    }

                    if (angular.lowercase(request.method) == 'post' && !_.isEmpty(request.data)) {
                        var config = {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var key in obj) {
                                    var sub = obj[key];
                                    for (var sk in sub) {
                                        var value = sub[sk];
                                        if (value === undefined || value === null) {
                                            continue;
                                        }
                                        if (_.isObject(value)) {
                                            if (_.isDate(value)) {
                                                if (isNaN(value.getTime())) {
                                                    continue;
                                                }
                                                value = $filter('date')(value, 'yyyy-MM-dd HH:mm:ss')
                                            }
                                            if (value.time) {
                                                value = $filter('date')(new Date(value.time), 'yyyy-MM-dd HH:mm:ss')
                                            }
                                        }
                                        str.push(key + '.' + encodeURIComponent(sk) + "=" + encodeURIComponent(value));
                                    }
                                }
                                return str.join("&");
                            }
                        }
                        _.extend(request, config);
                    }

                    return request || $q.when(request);
                },
                'response': function (response) {
                    cfpLoadingBar.complete();

                    return response || $q.when(response);
                },

                'responseError': function (rejection) {
                    cfpLoadingBar.complete();
                    // 网络中断或服务器关闭
                    if (rejection.status == 0 || rejection.status == 502) {
                        window.location.reload();
                        return;
                    }

                    alert(rejection.status);
                    return $q.reject(rejection);
                }
            };
        });

    })

    .controller('MainCtrl', function ($scope, $rootScope, $state) {

        $rootScope.contextPath = '/lsc';

        $scope.back = function () {
            $state.transitionTo('meeting.overview');
        }

        $scope.menuList = [
            {href: '', src: ['images/front/menu_01a.png', 'images/front/menu_01b.png']},
            {href: '', src: ['images/front/menu_02a.png', 'images/front/menu_02b.png']},
            {href: '#/meeting/overview', src: ['images/front/menu_03a.png', 'images/front/menu_03b.png']},
            {href: '#/meeting/overview', src: ['images/front/menu_04a.png', 'images/front/menu_04b.png']},
            {href: '', src: ['images/front/menu_05a.png', 'images/front/menu_05b.png']},
            {href: '', src: ['images/front/menu_06a.png', 'images/front/menu_06b.png']}
        ]
    })
;
