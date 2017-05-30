let express = require('express'),
    compression = require('compression'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    dist = path.join(__dirname, '../', 'dist'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    config = require('./config'),
    api = require('./api'),
    app = express();

app.set('port', config.port);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(serveStatic('./'));//make the bin directory and docs immediately accessible

api.then(
    (api) => {
        app.use(api);//mount all the API from any *.raml files

        let server = http.createServer(app);
        server.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    },
    (error) => {
        console.error(error);
    }
);


