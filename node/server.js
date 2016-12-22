var proxy = require('express-http-proxy');
var express = require('express');
var fs = require('fs');
var app = express();

var configFile = 'proxy-config.json';
var host = 'localhost:9090';
var authToken = 'nosecrets';
var port = '80';

//update configurations using config.json
var configuration = JSON.parse(
    fs.readFileSync(configFile)
);

host = configuration.apigw_ip_port.value;
port = configuration.local_webserver_port.value;
authToken = configuration.auth_token.value;

app.use(express.static('src'));

// Proxy mobile example to API gateway
var apiProxy = proxy(host, {										// ip and port off apigateway
	forwardPath: function (req, res) {
	    return require('url').parse(req.originalUrl).path;
	},
	
	decorateRequest: function(req) {
		req.headers['auth-token'] = authToken		// api_token for mobile user
		req.headers['Content-Type'] = 'application/json'
		console.log(req.path, req.headers);
	    return req;
	}
});

app.use("/MobileTicket/branches/*", apiProxy);
app.use("/MobileTicket/services/*", apiProxy);
app.use("/MobileTicket/MyVisit/*", apiProxy);
app.use("/rest/servicepoint/*", apiProxy); 
app.use("/rest/entrypoint/*", apiProxy); 

var server = app.listen(port, function () {  										// port the mobileTicket will listen to.
	var listenAddress = server.address().address;
	var listenPort = server.address().port;

	console.log("Mobile Ticket app listening at http://%s:%s", listenAddress, listenPort);

});