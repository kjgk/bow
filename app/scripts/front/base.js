'use strict';

angular.module('base', ['common'])

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
