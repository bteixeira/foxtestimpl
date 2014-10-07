var express = require('express');
var app = express();

app.use(express.static('public'));

var PORT = 3000;

app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
