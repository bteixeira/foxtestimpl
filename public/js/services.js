(function () {

    var services = angular.module('foxtest.services', []);


    /**
     * Base "class" for services. Takes care of the authentication and sets necessary headers.
     * The returned service has only a "request" method with arguments:
     *      String operation, the service to invoke
     *      optional Object data, will be serialized to form data
     *      Function callback, will be invoked with the response data
     */
    services.factory('foxService', function ($http, config) {
        var access = config.username + ':' + config.password;

        $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa(access);

        return {
            request: function (operation, data, callback) {
                if (arguments.length < 3) {
                    callback = data;
                    data = undefined;
                }
                data = angular.isUndefined(data) ? '' : $.param(data); // if there is data, serialize it (need jQuery for this -_- )
                $http.post(config.urls[operation], data, {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(callback); // TODO handle possible error
            }
        };
    });


    /**
     * This service gets new offers from the server.
     */
    services.factory('offersService', function (foxService, tokenService) {

        return {
            getOffers: function (callback) {
                tokenService.getToken(function (token) {
                    foxService.request('offers', {token: token}, callback);
                });
            }
        };
    });


    /**
     * This service returns an access token obtained from the server. The token is only obtained once and then cached.
     */
    services.factory('tokenService', function (foxService) {

        var token;

        function getNewToken(callback) {
            foxService.request('token', callback);
        }

        return {
            getToken: function (callback) {
                if (angular.isUndefined(token)) { // Only get token if one isn't already available. A little callback hell.
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


    /**
     * Application configuration. Not exactly a service.
     */
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
