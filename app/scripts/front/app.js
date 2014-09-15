'use strict';

angular.module('app', ['front.meeting'])
    .config(function ($httpProvider, $stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

        $urlRouterProvider.otherwise('/meeting');

        $httpProvider.interceptors.push(['$q', '$location' , 'cfpLoadingBar', function ($q, $location, cfpLoadingBar) {
            return {
                'request': function (request) {

                    if (request.url.indexOf("/admin") == 0) {
                        request.url = "/lsc" + (request.url[0] == '/' ? '' : '/') + request.url;
                    }

                    if (request.cfpLoading === undefined || request.cfpLoading) {
                        cfpLoadingBar.start();
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
        }]);

        cfpLoadingBarProvider.includeSpinner = false;
    })

    .controller('MainCtrl', function ($scope, $state) {

        $scope.back = function(){
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
