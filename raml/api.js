let url = require('url'),
    config = require('./config'),
    Router = require('express').Router,
    osprey = require('osprey'),
    path = require('path'),
    ospreyMock = require('osprey-mock-service'),
    fs = require('fs'),
    raml = require('raml-parser'),
    api = new Router(),
    dir = __dirname,
    files = fs.readdirSync(dir).filter(file => file.endsWith('.raml'));

function redirectMockResources(resources = [], startingPath = '') {
    resources.forEach(r => {
        //raml route uses {uriParam} but express route uses :uriParam
        let current = `${startingPath}${r.relativeUri}`.replace(/{([\w_]+)}/gim, (m, p) => `:${p}`),
            redirect = (req, res) => {
                console.log(`redirecting mock to /mock${req.baseUrl}${url.parse(req.url).path}`);
                res.redirect(307, `/mock${req.baseUrl}${url.parse(req.url).path}`);
            };

        //walk children first as they would be more specific route match than parent
        redirectMockResources(r.resources, current);
            
        if (r.is && r.is.includes('mock')) {
            console.log(`mocking [all] from ${current}`);
            api.use(current, redirect);
        }
        else if (r.methods) {
            r.methods.forEach(m => {
                if (m.is && m.is.includes('mock')) {
                    console.log(`mocking [${m.method}] from ${current}`);
                    api[m.method.toLowerCase()](current, redirect);
                }
            });
        }
    });
}

/**
 * Reads the RAML root directory for any *.raml files and loads
 * a middleware server for each for validation and fallback
 * mock responses. If we find a matching *.js file for the given
 * *.raml file in this directory, we will register it as part
 * of the middleware between validation and mocks.
 */
module.exports = Promise.all(files.map(file => {
    return raml.loadFile(path.join(dir, file)).then(raml => {
        let filename = file.substr(0, file.lastIndexOf('.'));

        console.log(`registering ${file} on ${raml.baseUri}`);
        
        let router;

        try {
            router = require(path.join(__dirname, filename));
        }
        catch (e) {
            console.error(e);
        }

        try {
            //fixes issue with osprey not registering all schemas
            (raml.schemas || []).forEach(schemas => Object.keys(schemas).forEach(key => osprey.addJsonSchema(JSON.parse(schemas[key]), key)));
            
            //setup base RAML validation of incoming request
            api.use(raml.baseUri, osprey.server(raml, {
                discardUnknownHeaders: false
            }));
            api.use(raml.baseUri, osprey.errorHandler(raml));

            //host mocks with a mock prefix in the url
            if (config.mocks === 'json-server') {
                const jsonServer = require('json-server');
                api.use('/mock' + raml.baseUri, jsonServer.router(path.resolve(__dirname, `${filename}.json`)));
            }
            else {
                api.use('/mock' + raml.baseUri, ospreyMock(raml));
            }

            //redirect any resources with "mock" flag first to go directly to mocks
            redirectMockResources(raml.resources, raml.baseUri);

            //redirect traffic to a proxy if specified
            if (config.proxy) {
                const proxy = require('express-http-proxy');
                const serverUrl = url.parse(config.proxy);

                console.log(`proxying ${raml.baseUri} to ${config.proxy}`);

                api.use(raml.baseUri, proxy(serverUrl.host, {
                    https: serverUrl.protocol === 'https:',
                    decorateRequest: (proxyReq) => {
                        proxyReq.headers.referer = serverUrl.href;
                        proxyReq.headers.host = serverUrl.host;
                        return proxyReq;
                    },
                    intercept: (rsp, data, req, res, callback) => {
                        if (res._headers['set-cookie']) {
                            //fix any set cookie headers specific to the proxied domain back to the local domain
                            let localDomain = req.headers.host.substr(0, req.headers.host.indexOf(':') || req.headers.length),
                                proxyDomain = url.parse(config.proxy).host;

                            res._headers['set-cookie'] = JSON.parse(JSON.stringify(res._headers['set-cookie']).replace(proxyDomain, localDomain));
                        }

                        if (res._headers['location']) {
                            //fix any location headers back to app root rather than relative
                            res.location('/' + res._headers['location']);
                            res.end();
                            return;
                        }

                        try {
                            callback(null, data);// eslint-disable-line callback-return
                        }
                        catch (e) {
                            console.log(e);
                        }
                    },
                    forwardPath: (req) => {
                        //forward to proxy with same url including the prefix
                        return `${serverUrl.path}${req.baseUrl}${url.parse(req.url).path}`;
                    }
                }));
            }
            //mount local implementation if available and no proxy
            else if (router) {
                api.use(raml.baseUri, router);
            }
            console.log(`registered ${file} on ${raml.baseUri}`);
        }
        catch (e) {
            console.log(e);
        }
    });
})).then(() => api, (error) => console.error(error));