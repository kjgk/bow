'use strict';

angular.module('base', ['common', 'ui.router', 'LocalStorageModule', 'angular-loading-bar', 'ngQuickDate'])

    .directive('pagination', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/front/base/pagination.html',
            scope: {
                grid: '=grid'
            }
        };
    })
;
