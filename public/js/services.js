(function () {

    var services = angular.module('foxtest.services', []);
    services.factory('offersService', function (foxService, tokenService) {

        //    var offersService = {};
        //
        //
        //
        //    offersService.getOffers = function () {
        //        return $http.post(
        //            'http://foxtest.herokuapp.com/v1/offers', $.param({ // guess jQuery is still needed after all...
        //                token: 'mS5ZCiX6zHHRNeZf30FB1VNSNX1Rp37gn80y5DGQ'
        //            }), {
        //                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        //            });
        //    };
        //
        //    return offersService;

        return {
            getOffers: function (callback) {
                tokenService.getToken(function (token) {
                    foxService.request('offers', {token: token}, callback);
                });
            }
        };

    });

    services.factory('tokenService', function (foxService) {

        var token;

        function getNewToken(callback) {
            foxService.request('token', callback);
        }

        return {
            getToken: function (callback) {
                if (angular.isUndefined(token)) {
                    getNewToken(function (response) {
                        token = response.token;
                        callback(token);
                    });
                } else {
                    callback(token);
                }
            }
        };

    });

    services.factory('foxService', function ($http, config) {

        var access = config.username + ':' + config.password;

        $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa(access);

        return {
            request: function (operation, data, callback) {
                if (arguments.length < 3) {
                    callback = data;
                    data = undefined;
                }
                data = angular.isUndefined(data) ? '' : $.param(data);
                $http.post(config.urls[operation], //$.param( // guess jQuery is still needed after all...
                    //   token: 'mS5ZCiX6zHHRNeZf30FB1VNSNX1Rp37gn80y5DGQ'
                    data
                //)
                    , {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(callback);
            }
        };

    });


    services.factory('config', function () {
        var config = {
            operations: {
                TOKEN: 'token',
                OFFERS: 'offers'
            },
            username: 'locafox',
            password: 'LocaF#xes!',
            foxBaseURL: 'http://foxtest.herokuapp.com/v1/'
        };

        /* Overly complicated way to concatenate the base URL with each one of the operation endpoints */
        config.urls = Object.keys(config.operations).reduce(function (obj, key) {
            var operation = config.operations[key];
            obj[operation] = config.foxBaseURL + operation;
            return obj;
        }, {});

        return config;

    });

})();
