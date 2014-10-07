$(function () {

    var mapOptions = {
        center: {
            lat: 52.51,
            lng: 13.37
        },
        zoom: 12
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    function pos(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    }

    function marker(lat, lng) {
        var latlng = pos(lat, lng);
        return new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Hello World!",
            animation: google.maps.Animation.DROP
        });
    }

    var TOKEN = 'token';
    var OFFERS = 'offers';

    var cfg = {};

    cfg.foxUrl = 'http://foxtest.herokuapp.com/v1/';
    cfg.urls = [TOKEN, OFFERS].reduce(function (obj, operation) {
        obj[operation] = cfg.foxUrl + operation;
        return obj;
    }, {});

    function foxjax(operation, data, callback) {
        var url = cfg.urls[operation];
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: callback,
            error: function () {
                var msg = 'There was an error while invoking\n' + url;
                console.log(msg);
                alert(msg + '\n\nSorry for the ugly alert message.');
            },
            headers: {
                'Authorization': 'Basic ' + btoa('locafox:LocaF#xes!')
            }
        });
    }

    var markers = [];

    function fetchOffers() {
        foxjax(TOKEN, {}, function (data) {
                cfg.token = data.token;
                foxjax(OFFERS, {token: cfg.token}, function (data) {
                    var i = 0;

                    function getDelay() {
                        return Math.round(Math.random() * 50) + 20; // between 20 and 70
                    }

                    function schedule() {
                        if (i >= data.length) {
                            return;
                        }
                        var m = marker(data[i].lat, data[i].long);
                        markers.push(m);
                        i++;
                        setTimeout(schedule, getDelay());
                    }

                    schedule();
                });
            }
        );
    }

    fetchOffers();

    $('#js-more').on('click', function (ev) {
        ev.preventDefault();
        fetchOffers();
    });

    $('#js-clear').on('click', function (ev) {
        ev.preventDefault();
        $.each(markers, function (i, m) {
            m.setMap(null);
        });
        markers = [];
    });

});
