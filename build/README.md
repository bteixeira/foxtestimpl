# Locafox Code Challenge

Thank you for downloading our challenge. We hope you'll have as much fun solving it as we did writing it.

**Note:** The included binary only runs on OS X. Please contact Rob for a hosted URL if you use a different OS. You may use a programming language of your choice, but keep in mind you will need to work with the [Google Maps API](https://developers.google.com/maps/). We would recommend a Backbone.js, AngularJS or [insert fancy JS framework] application that makes requests to the included server.

## Solving the Challenge

1. Start the server included in this package (it runs on port 3000 so ensure its available):

    ```
    ./foxtest
    ```

2. Send a `POST` request to the endpoint: `http://127.0.0.1:3000/v1/token`. It will return a unique 40 character token.

3. Send a `POST` request to the endpoint: `http://127.0.0.1:3000/v1/offers`. It will return a random list of Berlin offers in the format:

    ```js
    [
      {
        "id": 0,
        "lat": 52.5452407270436,
        "long": 13.412785613836808
      }
    ]
    ```

4. Display these offers as points on a Google Map.

## Basic Authentication

All API requests require the following Basic Authentication header:

* Username: locafox
* Password: LocaF#xes!

If you do not authenticate you'll recieve a HTTP 401 response. e.g:

```
$ curl -XPOST -I http://127.0.0.1:3000/v1/token
HTTP/1.1 401 Unauthorized
Www-Authenticate: Basic realm="Authorization Required"
Date: Wed, 01 Oct 2014 16:50:48 GMT
Content-Length: 0
Content-Type: text/plain; charset=utf-8
```

## Berlin Offers

All offers returned from the `/v1/offers` endpoint are automatically constrained to the city of Berlin, Germany. We have
used a boundary box with following geo coordinates:

 * Top-Left Corner: `52.55, 13.24`
 * Bottom-Rigth Corner: `52.47, 13.50`

If you are trying to develop your own server that matches our speficiation please ensure your offers are generated within this boundary.

## Questions / FAQ?

* TODO
* For all other enquiries, ping Rob Morgan (rob.morgan@locafox.de)
