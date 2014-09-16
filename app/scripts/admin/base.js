'use strict';

angular.module('base', ['common', 'ui.router', 'angular-loading-bar', 'angularFileUpload'])

    .directive('pagination', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/admin/base/pagination.html',
            scope: {
                grid: '=grid'
            }
        };
    })
;
