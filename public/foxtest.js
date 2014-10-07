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
            title:"Hello World!"
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
        $.ajax({
            url: cfg.urls[operation],
            type: 'POST',
            data: data,
            success: callback,
            headers: {
                'Authorization': 'Basic ' + btoa('locafox:LocaF#xes!')
            }
        });
    }

    foxjax(TOKEN, {}, function (data) {
            cfg.token = data.token;
            foxjax(OFFERS, {token: cfg.token}, function (data) {
                $.each(data, function(i, offer) {
                    console.log(offer);
                    marker(offer.lat, offer.long);
                });
            });
        }
    );

});
