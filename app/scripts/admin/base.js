'use strict';

angular.module('base', ['ui.router', 'LocalStorageModule', 'uuid4'])

    .directive('pagination', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/admin/base/pagination.html',
            scope: {
                grid: '=grid'
            }
        }
    })

    .provider('SimpleGrid', function () {
        this.$get = function () {
            return  function SimpleGrid(fetchFn, options) {
                if (!(this instanceof SimpleGrid)) {
                    return new SimpleGrid(fetchFn, options);
                }

                options = options || {};

                var self = {
                    data: [],
                    params: {},
                    currentPage: 1,
                    pageSize: options.pageSize || 10,
                    totalPage: 1,
                    nextPage: function () {
                        this.fetchData(this.currentPage + 1);
                    },
                    prePage: function () {
                        this.fetchData(this.currentPage - 1);
                    },
                    firstPage: function () {
                        this.fetchData(1);
                    },
                    lastPage: function () {
                        this.fetchData(this.totalPage);
                    },
                    hasNextPage: function () {
                        return this.currentPage < this.totalPage;
                    },
                    hasPrePage: function () {
                        return this.currentPage > 1;
                    },
                    fetchData: function (page) {
                        var grid = this;
                        page = page || grid.currentPage;
                        var params = _.extend(grid.params || {}, {
                            page: page,
                            pageSize: grid.pageSize
                        });
                        fetchFn(params).then(function (result) {
                            grid.data = result.items;
                            grid.totalPage = Math.ceil(result.totalCount / grid.pageSize);
                            grid.currentPage = page;
                        });
                    },
                    refresh: function () {
                        self.fetchData();
                    },
                    query: function (params) {
                        _.extend(this.params, params);
                        this.fetchData(1);
                    }
                };
                _.extend(this, self);
            }
        }
    })

    .filter('$date', function ($filter) {
        return function (input, format) {
            format = format || 'yyyy-MM-dd HH:mm';
            return $filter('date')(input, format);
        };
    })
;
