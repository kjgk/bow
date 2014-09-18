'use strict';

angular.module('common', ['ui.router', 'validation', 'validation.rule', 'angular-loading-bar', 'ngQuickDate'])

    .value('MeetingApplyStatus', {
        DRAFT: 1,
        SUBMIT: 2,
        SUCCESS: 3,
        FAIL: 4
    })

    .value('PageContext', PageContext)

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

angular.module('validation.rule', [])
    .config(['$validationProvider',
        function ($validationProvider) {

            var expression = {
                required: function (value) {
                    return !!value;
                },
                url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                number: /^\d+$/
            };

            var defaultMsg = {
                required: {
                    error: '必填项',
                    success: '<i class="fa fa-check"></i>'
                },
                url: {
                    error: 'Url格式不正确',
                    success: '<i class="fa fa-check"></i>'
                },
                email: {
                    error: 'Email格式不正确',
                    success: '<i class="fa fa-check"></i>'
                },
                number: {
                    error: '请输入数字',
                    success: '<i class="fa fa-check"></i>'
                }
            };

            $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);

            $validationProvider.showSuccessMessage = false;

            $validationProvider.setErrorHTML(function (msg) {
                return '<p class="validation validation-invalid">' + msg + '</p>';
            });

            $validationProvider.setSuccessHTML(function (msg) {
                return '<p class="validation validation-valid">' + msg + '</p>';
            });

        }
    ])
;

var DateFormat = DateFormat.format;