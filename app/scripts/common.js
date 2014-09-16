'use strict';

angular.module('common', ['ui.router', 'angular-loading-bar', 'ngQuickDate'])

    .value('MeetingApplyStatus', {
        DRAFT: 1,
        SUBMIT: 2,
        SUCCESS: 3,
        FAIL: 4
    })

    .config(function (cfpLoadingBarProvider, ngQuickDateDefaultsProvider) {

        cfpLoadingBarProvider.includeSpinner = false;

        ngQuickDateDefaultsProvider.set({
            placeholder: '请选择日期',
            labelFormat: 'yyyy-MM-dd',
            dateFormat: 'yyyy-MM-dd',
            disableTimepicker: true,
            buttonIconHtml: '<i class="fa fa-calendar"></i>',
            nextLinkHtml: '<i class="fa fa-lg fa-arrow-right"></i>',
            prevLinkHtml: '<i class="fa fa-lg fa-arrow-left"></i>',
            closeButtonHtml: '',
            dayAbbreviations: ['日', '一', '二', '三', '四', '五', '六']
        });
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
                    params: options.params || {},
                    currentPage: 1,
                    pageSize: options.pageSize || 10,
                    totalPage: 1,

                    prePage: function () {
                        if (this.hasPrePage()) {
                            this.fetchData(this.currentPage - 1);
                        }
                    },
                    firstPage: function () {
                        if (this.hasPrePage()) {
                            this.fetchData(1);
                        }
                    },
                    nextPage: function () {
                        if (this.hasNextPage()) {
                            this.fetchData(this.currentPage + 1);
                        }
                    },
                    lastPage: function () {
                        if (this.hasNextPage()) {
                            this.fetchData(this.totalPage);
                        }
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
                        fetchFn(params).then(function (response) {
                            var result = response.data;
                            grid.data = result.rows;
                            grid.totalPage = Math.ceil(result.total / grid.pageSize);
                            grid.currentPage = page;
                        });
                    },
                    refresh: function () {
                        this.fetchData();
                    },
                    query: function (params) {
                        _.extend(this.params, params);
                        this.fetchData(1);
                    }
                };
                _.extend(this, self);
            };
        };
    })

    .filter('$date', function ($filter) {
        return function (input, format) {
            if (input) {
                format = format || 'yyyy-MM-dd HH:mm';
                if (_.isNumber(input)) {
                    return $filter('date')(input, format);
                } else {
                    return $filter('date')(input.time, format);
                }
            }
        };
    })

    .filter('useDateText', function () {
        return function (input) {
            if (input) {
                var type = {
                    1: '上午',
                    2: '下午',
                    3: '全天'
                };
                return DateFormat.date(new Date(input.useDateStart.time), 'yyyy-MM-dd')
                    + ' ' + type[input.useDateStartType]
                    + (input.useDateEnd ?
                        (' 至 ' + DateFormat.date(new Date(input.useDateEnd.time), 'yyyy-MM-dd') + ' ' + type[input.useDateEndType] ) : '');
            }
        };
    })

    .filter('meetingServiceText', function () {
        return function (input) {
            if (input) {

                return _.pluck(input, "serviceName").join("、")
            }
        };
    })
;

var DateFormat = DateFormat.format;
