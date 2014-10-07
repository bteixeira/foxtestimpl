angular.module('foxtestApp.services', []).factory('offersService', function ($http) {

    var offersService = {};

    $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('locafox:LocaF#xes!');

    offersService.getOffers = function () {
        return $http.post(
            'http://foxtest.herokuapp.com/v1/offers', $.param({ // guess jQuery is still needed after all...
                token: 'mS5ZCiX6zHHRNeZf30FB1VNSNX1Rp37gn80y5DGQ'
            }), {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
    };

    return offersService;
});