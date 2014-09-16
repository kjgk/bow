'use strict';

angular.module('app', ['admin.meeting'])
    .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/meeting');

        $httpProvider.interceptors.push(function ($q, $location, $filter, cfpLoadingBar, contextPath) {
            return {
                'request': function (request) {

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

    .controller('MainCtrl', function ($scope, $rootScope, $state, contextPath) {

        $rootScope.contextPath = contextPath;

        $scope.onlyAfterDays = function (d) {
            return new Date().getTime() < (d.getTime() + 1000 * 60 * 60 * 24);
        };
    })
;
