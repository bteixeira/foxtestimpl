(function () {

    var map;
    var markers = [];

    /**
     * Takes an array of {lat, long} coordinate objects obtained from the fox server.
     * For each one, drops a pin on the map.
     */
    function dropMarkers(markers_) {

        /**
         * Instantiate marker and drop it on the map.
         */
        function putMarker(lat, lng) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);
            //could not solve flickering of markers: https://code.google.com/p/gmaps-api-issues/issues/detail?id=3608
        }

        /**
         * Gets a random number between 20 and 70
         */
        function getDelay() {
            return Math.round(Math.random() * 50) + 20;
        }

        var i = 0;

        /**
         * Don't drop all the pins at the same time. Instead space them out randomly for a nice effect.
         */
        (function schedule() {
            if (i >= markers_.length) {
                return;
            }
            putMarker(markers_[i].lat, markers_[i].long);
            i++;
            setTimeout(schedule, getDelay());
        })();

    }

    angular.module('foxtest', [
        'foxtest.controllers',
        'foxtest.services'
    ]);

    angular.module('foxtest.controllers', []).controller('foxtestCtrl', function ($scope, offersService) {

        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: {
                lat: 52.51,
                lng: 13.37
            },
            zoom: 12
        });

        /* Show user location if available. */
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var foxMarker = new google.maps.Marker({
                    position: initialLocation,
                    map: map,
                    animation: google.maps.Animation.BOUNCE,
                    icon: '/img/fox-only.png'
                });
                /* Give the user a chance to stop the annoying bouncing. */
                google.maps.event.addListener(foxMarker, 'click', function () {
                    if (foxMarker.getAnimation()) {
                        foxMarker.setAnimation(null);
                    } else {
                        foxMarker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                });


            });
        }

        $scope.clearMap = function () {
            $.each(markers, function (i, marker) {
                marker.setMap(null);
            });
            markers = [];
        };

        $scope.fetchOffers = function () {
            offersService.getOffers(function (response) {
                dropMarkers(response);
            });
        };

        $scope.fetchOffers();

    });

})();
